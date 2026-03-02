import sys

if len(sys.argv) < 2:
    print("Usage: calculate.py <expression>")
    sys.exit(1)

expression = sys.argv[1]
try:
    result = eval(expression)
    print(f"Result: {result}")
except Exception as e:
    print(f"Error: {e}")