import os
import json

fileName1 = os.path.dirname(os.path.realpath(__file__)) + '/' + "1.json"
fileName2 = os.path.dirname(os.path.realpath(__file__)) + '/' + "self.json"
newName = os.path.dirname(os.path.realpath(__file__)) + '/' + "merged.json"
with open(fileName1, encoding='utf-8') as f:
    f1 = json.load(f)
with open(fileName2, encoding='utf-8') as f:
    f2 = json.load(f)

with open(newName, "a", encoding="utf-8") as f:
    f.writelines(json.dumps(f1 + f2))
