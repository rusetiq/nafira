#!/usr/bin/env python3
import sys
import json
import os
from pathlib import Path

try:
    from transformers import AutoTokenizer, AutoModelForCausalLM
    from PIL import Image
    import torch
except ImportError as e:
    error_msg = {
        "error": f"Missing dependencies: {str(e)}",
        "fallback": True,
        "install_command": "pip install transformers torch pillow"
    }
    print(json.dumps(error_msg))
    sys.exit(1)

MODEL_PATH = os.getenv("VISION_MODEL_PATH", r"C:\Users\r3nzd\Desktop\rtqvlmllm\rusetiq\rtqVLM-0.5B")
IMAGE_TOKEN_INDEX = -200

def analyze_meal_image(image_path, prompt=None):

    try:
        if not os.path.exists(MODEL_PATH):
            return json.dumps({
                "error": f"Model path not found: {MODEL_PATH}",
                "fallback": True
            })
        
        try:
            tok = AutoTokenizer.from_pretrained(MODEL_PATH, trust_remote_code=True)
            model = AutoModelForCausalLM.from_pretrained(MODEL_PATH, trust_remote_code=True)
        except Exception as e:
            return json.dumps({
                "error": f"Failed to load model: {str(e)}",
                "fallback": True
            })
        
        if not os.path.exists(image_path):
            return json.dumps({
                "error": f"Image not found: {image_path}",
                "fallback": True
            })
        
        image = Image.open(image_path).convert("RGB")
        
        if not prompt:
            prompt = """describe the food in photo and give json output with:
{
  "name": "meal name",
  "score": health score %,
  "carbs": estimated carbs in grams,
  "protein": estimated protein in grams,
  "fats": estimated fats in grams,
  "calories": estimated calories,
  "hydration": how hydrated the meal is,
  "advice": "health advice based on the meal",
  "ingredients": ["list", "of", "ingredients"],
  "strengths": ["positive", "aspects"],
  "improvements": ["suggested", "improvements"]
}
note: for health score be honest dont give a high score if the meal is not healthy, just write ingredient names no descriptions of them, put comma after each field in json, ingredients should be a list of strings strictly.
"""        
        try:
            rendered = tok.apply_chat_template(
                [{"role": "user", "content": "<image>\n" + prompt}], 
                add_generation_prompt=True, 
                tokenize=False
            )
            pre, post = rendered.split("<image>", 1)
        except Exception:
            pre = ""
            post = "<image>\n" + prompt
        
        pre_ids = tok(pre, return_tensors="pt", add_special_tokens=False).input_ids
        post_ids = tok(post, return_tensors="pt", add_special_tokens=False).input_ids
        img_tok = torch.tensor([[IMAGE_TOKEN_INDEX]], dtype=pre_ids.dtype)
        input_ids = torch.cat([pre_ids, img_tok, post_ids], dim=1)
        attention_mask = torch.ones_like(input_ids)
        
        px = model.get_vision_tower().image_processor(images=image, return_tensors="pt")["pixel_values"]
        
        device = next(model.parameters()).device
        input_ids = input_ids.to(device)
        attention_mask = attention_mask.to(device)
        px = px.to(device, dtype=next(model.parameters()).dtype)
        
        with torch.no_grad():
            out = model.generate(
                inputs=input_ids,
                attention_mask=attention_mask,
                images=px,
                max_new_tokens=256,
                eos_token_id=tok.eos_token_id,
                pad_token_id=tok.eos_token_id
            )
        
        response_text = tok.decode(out[0], skip_special_tokens=True)
        
        json_match = None
        import re
        json_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
        matches = re.findall(json_pattern, response_text, re.DOTALL)
        
        if matches:
            for match in sorted(matches, key=len, reverse=True):
                try:
                    analysis = json.loads(match)
                    return json.dumps(analysis)
                except:
                    continue
        
        try:
            analysis = json.loads(response_text)
            return json.dumps(analysis)
        except:
            return json.dumps({
                "error": "Could not parse JSON from model response",
                "raw_response": response_text[:500],
                "fallback": True
            })
            
    except Exception as e:
        return json.dumps({
            "error": f"Vision model error: {str(e)}",
            "fallback": True
        })


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python visionModelService.py <image_path> [prompt]"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    prompt = sys.argv[2] if len(sys.argv) > 2 else None
    
    result = analyze_meal_image(image_path, prompt)
    print(result)

