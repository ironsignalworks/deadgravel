from pathlib import Path
lines=Path('assets/js/main.js').read_text().splitlines()
for i,line in enumerate(lines,1):
    print(f"{i:03d}: {line}")
