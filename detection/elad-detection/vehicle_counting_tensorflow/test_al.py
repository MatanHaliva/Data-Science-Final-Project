import json
from openalpr import Alpr

alpr = Alpr("us", "/path/to/openalpr.conf", "/path/to/runtime_data")
if not alpr.is_loaded():
    print("Error loading OpenALPR")
    sys.exit(1)
results = alpr.recognize_file("Images/Processing/a4688949-2a5e-4a9b-a8ef-2218a79ab8ec/213201")
print(results)
#print(json.dumps(results, indent=4))
alpr.unload()