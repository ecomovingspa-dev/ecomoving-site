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
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Uso: python notebooklm_query.py <notebook_id> <query_text>"}))
        return

    notebook_id = sys.argv[1]
    query_text = sys.argv[2]
    conversation_id = sys.argv[3] if len(sys.argv) > 3 else None

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
        
        result = client.query(
            notebook_id=notebook_id,
            query_text=query_text,
            conversation_id=conversation_id
        )
        
        # Limpiar basura del final si existe (bug frecuente en el parsing de streaming)
        if result and "answer" in result and result["answer"]:
            # Eliminar fragmentos como \"]]]]]]],null,null,nul
            clean_answer = result["answer"]
            garbage_markers = ["\"]", "]]", "null,null"]
            for marker in garbage_markers:
                if marker in clean_answer:
                    # Si el marcador aparece muy cerca del final, truncamos
                    pos = clean_answer.find(marker)
                    if pos > len(clean_answer) * 0.8: # Solo si esta al final
                        clean_answer = clean_answer[:pos].strip()
            
            # Limpiar comillas escapadas si quedaron
            clean_answer = clean_answer.replace('\\"', '"').strip()
            result["answer"] = clean_answer

        print(json.dumps(result))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
