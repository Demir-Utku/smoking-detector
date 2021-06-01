try:
    import io
    from io import BytesIO
    import pandas as pd
    from google.cloud import storage
    import os.path

except Exception as e:
    print("Some Modules are Missing {}".format(e))

storage_client = storage.Client.from_service_account_json("daring-keep-300018-10b7308e2831.json")

# creating bucket
bucket = storage_client.get_bucket("bitirme_1")

i = 0

while True:
    image = "detected/" + str(i) + ".jpg"   # path to saved frame
    filename = "%s/%s" % ('', image)

    textClientIP = "detected/" + str(i) + ".txt"   # path to .txt file storing the client IP
    f = open(textClientIP, "r")   # read client IP
    clientIP = (f.readline())   # store the IP in clientIP
    f.close()   # close the .txt

    blob = bucket.blob(filename)   # object definition for GCS
    if os.path.isfile(image):   # check the existence of the frame
        with open(image, 'rb') as f:
            blob.upload_from_file(f)   # upload the frame to GCS bucket
        metadata = {'Client IP': clientIP}  # define metadata for client IP
        blob.metadata = metadata  # assign metadata for client IP
        blob.patch()
    else:
        print(i + ".jpg File does not exist.")
        break
    i += 1

print("Upload completed")
