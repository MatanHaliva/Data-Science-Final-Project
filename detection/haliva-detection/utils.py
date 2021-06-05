
def crop_person_from_frame(frame, detection):
    box = detection["location"]
    x = int(box[0])
    y = int(box[1])
    w = int(box[2])
    h = int(box[3])
    x_plus_w = int(x+w)
    y_plus_h = int(y+h)

    if(x > 0 and y > 0):
        # Crop person from image
        human = frame[y:y_plus_h, x:x_plus_w]
        return human
    else:
        raise Exception("wrong person") 