import sys
import json
import os
from pathlib import Path

# Try to find the site-packages if not in path
site_packages = r"C:\Users\Mario\AppData\Local\Programs\Python\Python314\Lib\site-packages"
if site_packages not in sys.path:
    sys.path.append(site_packages)

try:
    from notebooklm_mcp.api_client import NotebookLMClient
    from notebooklm_mcp.auth import load_cached_tokens
except ImportError as e:
    print(json.dumps({"error": f"Error importando la librería: {e}"}))
    sys.exit(1)

def main():
    try:
        tokens = load_cached_tokens()
        if not tokens:
            print(json.dumps({"error": "No se encontraron tokens de autenticación."}))
            return

        client = NotebookLMClient(
            cookies=tokens.cookies,
            csrf_token=tokens.csrf_token,
            session_id=tokens.session_id
        )
        
        notebooks = client.list_notebooks()
        
        # Convert Notebook objects to dicts
        output = [
            {
                "id": n.id,
                "title": n.title,
                "source_count": n.source_count,
                "url": n.url
            }
            for n in notebooks
        ]
        
        print(json.dumps(output))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
