#!/usr/bin/env python3
"""
Script to convert TypeScript syntax to JavaScript in JSX files.
Removes type annotations, interfaces, and generics.
"""

import re
import os
import glob

def remove_typescript_syntax(content):
    """Remove TypeScript specific syntax from content."""
    
    # Remove interface definitions (multi-line)
    content = re.sub(r'export\s+interface\s+\w+(?:\s+extends\s+[^{]+)?\s*\{[^}]*\}\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'interface\s+\w+(?:\s+extends\s+[^{]+)?\s*\{[^}]*\}\n?', '', content, flags=re.DOTALL)
    
    # Remove type keyword imports (", type Foo" or ", type Foo,")
    content = re.sub(r',\s*type\s+\w+', '', content)
    
    # Remove "type " in imports at the start
    content = re.sub(r'\{\s*type\s+', '{ ', content)
    
    # Remove generic type parameters from React.forwardRef<Type1, Type2>
    content = re.sub(r'React\.forwardRef<[^>]+>', 'React.forwardRef', content)
    content = re.sub(r'forwardRef<[^>]+>', 'forwardRef', content)
    
    # Remove generic type parameters from useState<Type>
    content = re.sub(r'useState<[^>]+>\(', 'useState(', content)
    content = re.sub(r'React\.useState<[^>]+>\(', 'React.useState(', content)
    
    # Remove generic type parameters from useContext<Type>
    content = re.sub(r'useContext<[^>]+>\(', 'useContext(', content)
    content = re.sub(r'React\.useContext<[^>]+>\(', 'React.useContext(', content)
    
    # Remove generic type parameters from createContext<Type>
    content = re.sub(r'createContext<[^>]+>\(', 'createContext(', content)
    content = re.sub(r'React\.createContext<[^>]+>\(', 'React.createContext(', content)
    
    # Remove generic type parameters from useRef<Type>
    content = re.sub(r'useRef<[^>]+>\(', 'useRef(', content)
    content = re.sub(r'React\.useRef<[^>]+>\(', 'React.useRef(', content)
    
    # Remove generic type parameters from useCallback<Type>
    content = re.sub(r'useCallback<[^>]+>\(', 'useCallback(', content)
    content = re.sub(r'React\.useCallback<[^>]+>\(', 'React.useCallback(', content)
    
    # Remove type assertions with "as Type"
    # Be careful not to remove JSX spread attributes
    content = re.sub(r'\s+as\s+(?:const|unknown|any|string|number|boolean|Record<[^>]+>|React\.[A-Za-z]+(?:<[^>]+>)?|\w+(?:<[^>]+>)?)\b', '', content)
    
    # Remove function parameter type annotations: (param: Type) -> (param)
    # This pattern handles: param: Type, param?: Type, ...param: Type[]
    content = re.sub(r'(\w+)(\??)\s*:\s*[^,)=]+(?=[,)=])', r'\1', content)
    
    # Remove return type annotations: ): Type => or ): Type { 
    content = re.sub(r'\)\s*:\s*[^{=>]+\s*(=>|{)', r') \1', content)
    
    # Remove standalone "export type" declarations
    content = re.sub(r'export\s+type\s+\w+\s*=\s*[^;]+;\n?', '', content)
    content = re.sub(r'type\s+\w+\s*=\s*[^;]+;\n?', '', content)
    
    # Clean up empty lines that might have been created
    content = re.sub(r'\n\n\n+', '\n\n', content)
    
    return content

def process_file(filepath):
    """Process a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = remove_typescript_syntax(content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"Processed: {filepath}")
        return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_path = "/home/rounak-patel/Desktop/web_coding/saas/taxplanadvisor"
    
    # Find all JSX files in ui folder, NavLink, and use-mobile
    jsx_files = glob.glob(os.path.join(base_path, "src/components/ui/*.jsx"))
    jsx_files.append(os.path.join(base_path, "src/components/NavLink.jsx"))
    jsx_files.append(os.path.join(base_path, "src/hooks/use-mobile.jsx"))
    
    success_count = 0
    for filepath in jsx_files:
        if os.path.exists(filepath):
            if process_file(filepath):
                success_count += 1
    
    print(f"\nProcessed {success_count}/{len(jsx_files)} files successfully")

if __name__ == "__main__":
    main()
