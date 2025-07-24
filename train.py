# import torch
# import os

# # Clone YOLOv5 repo (only needed once)
# if not os.path.exists("yolov5"):
#     os.system("git clone https://github.com/ultralytics/yolov5")
#     os.system("pip install -r yolov5/requirements.txt")

# # Set your dataset YAML file
# DATASET_YAML = "data/dataset.yaml"  # Modify this path as needed

# # Training configuration
# TRAIN_PARAMS = {
#     'imgsz': 640,              # image size
#     'batch': 8,                # batch size
#     'epochs': 50,              # number of epochs
#     'data': DATASET_YAML,      # path to data.yaml
#     'cfg': 'yolov5s.yaml',     # model architecture
#     'weights': 'yolov5s.pt',   # pretrained weights
#     'name': 'custom_model',    # output folder name
#     'cache': True              # cache images for faster training
# }

# # Run training
# if __name__ == '__main__':
#     print("\nStarting YOLOv5 training...")
#     torch.hub.load('ultralytics/yolov5', 'custom', path='yolov5s.pt', force_reload=True)
#     os.system(
#         f"python yolov5/train.py --img {TRAIN_PARAMS['imgsz']} "
#         f"--batch {TRAIN_PARAMS['batch']} --epochs {TRAIN_PARAMS['epochs']} "
#         f"--data {TRAIN_PARAMS['data']} --cfg {TRAIN_PARAMS['cfg']} "
#         f"--weights {TRAIN_PARAMS['weights']} --name {TRAIN_PARAMS['name']} --cache"
#     )

import torch
from PIL import Image

# Load model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='yolov5/runs/train/exp/weights/best.pt')

# Load a test image
img = Image.open('yolo_inventory_example/test/images/your_test_image.jpg').convert('RGB')

# Run prediction
results = model(img)

# Print results
results.print()
results.show()

