#!/usr/bin/env python3
import sys
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import base64
from io import BytesIO

try:
    from transformers import AutoTokenizer, AutoModelForCausalLM
    from PIL import Image
    import torch
except ImportError as e:
    print(f"ERROR: Missing dependencies: {str(e)}", file=sys.stderr)
    print("Install with: pip install transformers torch pillow", file=sys.stderr)
    sys.exit(1)

MODEL_PATH = os.getenv("VISION_MODEL_PATH", r"C:\Users\r3nzd\Desktop\rtqvlmllm\rusetiq\rtqVLM-0.5B")
IMAGE_TOKEN_INDEX = -200
PORT = int(os.getenv("VISION_MODEL_PORT", "5001"))

model = None
tokenizer = None
model_loaded = False
load_lock = threading.Lock()

def load_model():
    global model, tokenizer, model_loaded
    with load_lock:
        if model_loaded:
            return True
        
        try:
            if not os.path.exists(MODEL_PATH):
                print(f"ERROR: Model path not found: {MODEL_PATH}", file=sys.stderr)
                return False
            
            print(f"Loading model from {MODEL_PATH}...", file=sys.stderr)
            tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, trust_remote_code=True)
            model = AutoModelForCausalLM.from_pretrained(MODEL_PATH, trust_remote_code=True)
            model_loaded = True
            print("Model loaded successfully!", file=sys.stderr)
            return True
        except Exception as e:
            print(f"ERROR: Failed to load model: {str(e)}", file=sys.stderr)
            return False

def analyze_image(image_data, prompt=None):
    global model, tokenizer
    
    if not model_loaded or model is None or tokenizer is None:
        return {"error": "Model not loaded", "fallback": True}
    
    try:
        print("[VisionModelServer] Starting image analysis...", file=sys.stderr)
        image = Image.open(BytesIO(image_data)).convert("RGB")
        
        if not prompt:
            prompt = """Analyze this meal image and provide a detailed nutritional assessment. Return a JSON object with:
{
  "name": "descriptive meal name",
  "score": health score 0-100,
  "carbs": estimated carbs in grams,
  "protein": estimated protein in grams,
  "fats": estimated fats in grams,
  "calories": estimated calories,
  "hydration": hydration level 0-100,
  "advice": "personalized health advice focusing on metabolic health, nutrient density, and improvements",
  "ingredients": ["list", "of", "identified", "ingredients"],
  "strengths": ["positive", "aspects"],
  "improvements": ["suggested", "improvements"]
}

Focus on metabolic health, inflammation markers, nutrient density, and provide actionable advice. Return only valid JSON."""
        
        try:
            rendered = tokenizer.apply_chat_template(
                [{"role": "user", "content": "<image>\n" + prompt}], 
                add_generation_prompt=True, 
                tokenize=False
            )
            pre, post = rendered.split("<image>", 1)
        except Exception:
            pre = ""
            post = "<image>\n" + prompt
        
        pre_ids = tokenizer(pre, return_tensors="pt", add_special_tokens=False).input_ids
        post_ids = tokenizer(post, return_tensors="pt", add_special_tokens=False).input_ids
        img_tok = torch.tensor([[IMAGE_TOKEN_INDEX]], dtype=pre_ids.dtype)
        input_ids = torch.cat([pre_ids, img_tok, post_ids], dim=1)
        attention_mask = torch.ones_like(input_ids)
        
        px = model.get_vision_tower().image_processor(images=image, return_tensors="pt")["pixel_values"]
        
        device = next(model.parameters()).device
        input_ids = input_ids.to(device)
        attention_mask = attention_mask.to(device)
        px = px.to(device, dtype=next(model.parameters()).dtype)
        
        with torch.no_grad():
            start = torch.cuda.Event(enable_timing=True) if torch.cuda.is_available() else None
            end = torch.cuda.Event(enable_timing=True) if torch.cuda.is_available() else None
            if start and end:
                start.record()

            out = model.generate(
                inputs=input_ids,
                attention_mask=attention_mask,
                images=px,
                max_new_tokens=512,
                eos_token_id=tokenizer.eos_token_id,
                pad_token_id=tokenizer.eos_token_id
            )

            if start and end:
                end.record()
                torch.cuda.synchronize()
                elapsed_ms = start.elapsed_time(end)
                print(f"[VisionModelServer] Generation time: {elapsed_ms:.2f} ms", file=sys.stderr)
        
        response_text = tokenizer.decode(out[0], skip_special_tokens=True)
        print("[VisionModelServer] Raw model response (truncated to 2000 chars):", file=sys.stderr)
        print(response_text[:2000], file=sys.stderr)
        
        import re
        json_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
        matches = re.findall(json_pattern, response_text, re.DOTALL)
        
        if matches:
            for match in sorted(matches, key=len, reverse=True):
                try:
                    analysis = json.loads(match)
                    print("[VisionModelServer] Parsed JSON analysis:", file=sys.stderr)
                    print(json.dumps(analysis, indent=2)[:2000], file=sys.stderr)
                    return analysis
                except Exception as e:
                    print(f"[VisionModelServer] JSON parse candidate failed: {e}", file=sys.stderr)
                    continue
        
        try:
            analysis = json.loads(response_text)
            print("[VisionModelServer] Parsed JSON analysis from whole response:", file=sys.stderr)
            print(json.dumps(analysis, indent=2)[:2000], file=sys.stderr)
            return analysis
        except Exception as e:
            print(f"[VisionModelServer] Failed to parse JSON from response: {e}", file=sys.stderr)
            return {
                "error": "Could not parse JSON from model response",
                "raw_response": response_text[:500],
                "fallback": True
            }
            
    except Exception as e:
        return {
            "error": f"Vision model error: {str(e)}",
            "fallback": True
        }

class VisionModelHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "status": "ok",
                "model_loaded": model_loaded
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/analyze':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                body_text = post_data.decode('utf-8')
                try:
                    data = json.loads(body_text)
                except json.JSONDecodeError as e:
                    print(f"[VisionModelServer] Invalid JSON payload: {e} - raw: {body_text[:500]}", file=sys.stderr)
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    try:
                        self.wfile.write(json.dumps({
                            "error": "Invalid JSON payload",
                            "fallback": True
                        }).encode())
                    except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError):
                        pass
                    return
                
                image_path = data.get('image_path')
                image_base64 = data.get('image_base64')
                prompt = data.get('prompt')

                print("[VisionModelServer] /analyze request received:", file=sys.stderr)
                print(f"  image_path: {image_path}", file=sys.stderr)
                if image_base64:
                    print(f"  image_base64: present ({len(image_base64)} chars)", file=sys.stderr)
                else:
                    print("  image_base64: none", file=sys.stderr)
                if prompt:
                    preview = prompt.replace("\n", " ")[:160]
                    print(f"  prompt: {preview}{'...' if len(prompt) > 160 else ''}", file=sys.stderr)
                else:
                    print("  prompt: None", file=sys.stderr)
                
                image_data = None
                if image_base64:
                    image_data = base64.b64decode(image_base64)
                elif image_path:
                    if os.path.exists(image_path):
                        with open(image_path, 'rb') as f:
                            image_data = f.read()
                    else:
                        self.send_response(400)
                        self.send_header('Content-Type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        try:
                            self.wfile.write(json.dumps({
                                "error": f"Image not found: {image_path}",
                                "fallback": True
                            }).encode())
                        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError):
                            pass
                        return
                else:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    try:
                        self.wfile.write(json.dumps({
                            "error": "Either image_path or image_base64 required",
                            "fallback": True
                        }).encode())
                    except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError):
                        pass
                    return
                
                result = analyze_image(image_data, prompt)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                try:
                    self.wfile.write(json.dumps(result).encode())
                except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError):
                    pass
                
            except Exception as e:
                if isinstance(e, (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError)):
                    print(f"Client disconnected during request: {e}", file=sys.stderr)
                    return

                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                try:
                    self.wfile.write(json.dumps({
                        "error": str(e),
                        "fallback": True
                    }).encode())
                except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError):
                    pass
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        pass

def main():
    print(f"Starting Vision Model Server on port {PORT}...", file=sys.stderr)
    
    if not load_model():
        print("Failed to load model. Server will start but analysis will fail.", file=sys.stderr)
    
    server = HTTPServer(('localhost', PORT), VisionModelHandler)
    print(f"Vision Model Server running on http://localhost:{PORT}", file=sys.stderr)
    print("Ready to process requests...", file=sys.stderr)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...", file=sys.stderr)
        server.shutdown()

if __name__ == "__main__":
    main()

