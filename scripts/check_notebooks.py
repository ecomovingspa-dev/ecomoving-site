import asyncio
import json
import os
from notebooklm_mcp_server.api import NotebookLMClient

async def main():
    try:
        client = NotebookLMClient()
        notebooks = await client.list_notebooks()
        
        if not notebooks:
            print("No se encontraron cuadernos o la sesión expiró.")
            return

        print("\n=== TUS CUADERNOS DE NOTEBOOKLM (VERIFICADOS) ===")
        for n in notebooks:
            title = n.get('title', 'Sin título')
            notebook_id = n.get('id', 'N/A')
            print(f"ID: {notebook_id} | TÍTULO: {title}")
        print("================================================\n")
            
    except Exception as e:
        print(f"Error al conectar con NotebookLM: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
