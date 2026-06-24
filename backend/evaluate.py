import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# -----------------------------
# 1. Load trained model
# -----------------------------
model = load_model("model.h5")   # change path if needed

# -----------------------------
# 2. Load validation/test data
# -----------------------------
IMG_SIZE = (224, 224)  # change if your model uses different size
BATCH_SIZE = 32

test_datagen = ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
    "data/test",        # 🔥 change this to your test/val folder path
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

# -----------------------------
# 3. Get predictions
# -----------------------------
y_pred = model.predict(test_generator)
y_pred_classes = np.argmax(y_pred, axis=1)

# True labels
y_true = test_generator.classes

# Class names
class_names = list(test_generator.class_indices.keys())

# -----------------------------
# 4. Accuracy
# -----------------------------
accuracy = accuracy_score(y_true, y_pred_classes)
print("\n✅ Accuracy:", accuracy)

# -----------------------------
# 5. Precision, Recall, F1
# -----------------------------
print("\n📊 Classification Report:\n")
print(classification_report(y_true, y_pred_classes, target_names=class_names))

# -----------------------------
# 6. Confusion Matrix
# -----------------------------
cm = confusion_matrix(y_true, y_pred_classes)
print("\n🔢 Confusion Matrix:\n", cm)

# -----------------------------
# 7. Plot Confusion Matrix
# -----------------------------
plt.figure(figsize=(6,5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=class_names,
            yticklabels=class_names)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.show()