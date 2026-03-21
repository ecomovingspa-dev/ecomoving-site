import asyncio
import os
import sys
from pathlib import Path

# Try to find the site-packages if not in path
site_packages = r"C:\Users\Mario\AppData\Local\Programs\Python\Python314\Lib\site-packages"
if site_packages not in sys.path:
    sys.path.append(site_packages)

try:
    from notebooklm_mcp.api_client import NotebookLMClient
    from notebooklm_mcp.auth import load_cached_tokens
except ImportError as e:
    print(f"Error importando la librería: {e}")
    sys.exit(1)

async def main():
    try:
        tokens = load_cached_tokens()
        if not tokens:
            print("No se encontraron tokens de autenticación.")
            return

        client = NotebookLMClient(
            cookies=tokens.cookies,
            csrf_token=tokens.csrf_token,
            session_id=tokens.session_id
        )
        
        # list_notebooks is NOT async according to the structure
        notebooks = client.list_notebooks()
        
        if not notebooks:
            print("No se encontraron cuadernos o la sesión expiró.")
            return

        print("\n=== TUS CUADERNOS DE NOTEBOOKLM ===")
        for n in notebooks:
            # Check if n is an object or dict
            title = getattr(n, 'title', n.get('title', 'Sin título') if isinstance(n, dict) else 'Sin título')
            notebook_id = getattr(n, 'id', n.get('id', 'N/A') if isinstance(n, dict) else 'N/A')
            print(f"ID: {notebook_id} | TÍTULO: {title}")
        print("==================================\n")
            
    except Exception as e:
        print(f"Error al conectar con NotebookLM: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
