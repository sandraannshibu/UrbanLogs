import os
from firebase_admin import credentials,db,storage
import firebase_admin
import hashlib

firebase_admin.initialize_app(credentials.Certificate('config/key.json'),{
  'apiKey': "AIzaSyBAOPIC2uWoC8ri28k3mKlE60YjDs19tLY",
  'authDomain': "urbanlogs-93ca7.firebaseapp.com",
  'databaseURL': "https://urbanlogs-93ca7-default-rtdb.firebaseio.com",
  'projectId': "urbanlogs-93ca7",
  'storageBucket': "urbanlogs-93ca7.appspot.com",
  'messagingSenderId': "958392069971",
  'appId': "1:958392069971:web:b1a7f6aa67abc7d24c3ba6"
})


class titlePrice:
  title = ''
  price = ''
  discount = ''
  def __init__(self,title,price,discount):
    self.title = title
    self.price = price
    self.discount = discount


prices = {
  'decors':{
    '1': titlePrice('Solano Mirror Gold - A11855',3500,0),
    '2':titlePrice('Hussar on horseback',5500,10),
    '3':titlePrice('DreamCatcher',2000,0),
    '4':titlePrice('Garden Urn',7000,0),
    '5':titlePrice('Hydria apothecary vase',2000,0),
    '6':titlePrice('Table Lamp 01',4000,25),
    '7':titlePrice('Deer Head Wall Decoration',8000,0),
    '8':titlePrice('Ornate Mirror',9000,0),
  },
  'chairs':{
    '1':titlePrice('Round Chair',6000,0),
    '2':titlePrice('Arm chair / Furniture',4000,0),
    '3':titlePrice('Day 241: Arm Chair',4000,0),
    '4':titlePrice('Leather Armchair',6000,0),
    '5':titlePrice('Morris Chair',7000,0),
  },
  'sofas_and_recliners':{
    '1':titlePrice('Sofá - IKEA NOCKEBY',7000,0),
    '2':titlePrice('Sofa Set',9000,0),
    '3':titlePrice('Sofa Set',8500,0),
    '4':titlePrice('Sofa - Long Sofa',7500,0),
    '5':titlePrice('Leather Bench',10000,15),
  },
  'tables':{
    '1':titlePrice('Table Set',20000,0),
    '2':titlePrice('Table - Hightop',4000,0),
    '3':titlePrice('Couch Table',8000,0),
    '4':titlePrice('Chinese square table',7000,0),
    '5':titlePrice('Industrial Table',7500,0),
  },
  'beds':{
    '1':titlePrice('Bed',18000,0),
    '2':titlePrice('Queen-bed',20000,0),
    '3':titlePrice('Bed with lamp',22000,0),
    '4':titlePrice('Bed',21000,0),
    '5':titlePrice('Bed',25000,0),
  },
  'cabinets':{
    '1':titlePrice('Cabinet Base Four Drawers',4500,0),
    '2':titlePrice('Modern Cabinet Hutch',8000,0),
    '3':titlePrice('TV cabinet',35000,0),
    '4':titlePrice('Book Cabinet (Vintage)',18000,0),
    '5':titlePrice('Book Cabinet',26000,0),
  },
  'sanskriti':{
    '1':titlePrice('Dublin Pub Chair/Stool',5000,0),
    '2':titlePrice('Fancy Table',3000,0),
    '3':titlePrice('Antique wardrobe',6000,0),
    '4':titlePrice('Antique wood Chair',7000,0),
    '5':titlePrice('Sofa Single',6000,0),
    '6':titlePrice('Chinese Yoke-Back Armchair - The Squire armchair',7000,0),
    '7':titlePrice('Antique Sofa',5000,0),
    '8':titlePrice('Dusty Antique Mirror',9000,0),
  },
  'carousel':{
    '1':titlePrice('Gaming Chair',12000,0),
    '2':titlePrice('Rectangular Desk',8000,0)
  }
}

def getTags(type):
  if type == 'decors':
    return [type]
  elif type == 'sanskriti':
    return [type]
  elif type == 'carousel':
    return ['carousel']
  else:
    return [type,'furniture']

class asset:
  key = ''
  title =''
  tags = []
  images = []
  price = []
  cover_image =''
  qr_code = ''
  discount = 0
  def __init__(self,k,title,tags,imgs,price,cover,qr,dis):
    self.key = k
    self.title = title
    self.tags = tags
    self.images = imgs
    self.price = price
    self.cover_image = cover
    self.qr_code = qr     
    self.discount = dis

def getCoverImage(type,imgs,carousel_img):
  if type == 'carousel':
    return carousel_img
  else:
    return imgs[0]

if __name__ == '__main__':

  db.reference().child('products').delete()
  
  assets=[]
  photos ={}
  usdz = {}
  for path, subdirs, files in os.walk('data'):
    for name in files:
        file_path = os.path.join(path, name)
        type = file_path.split('\\')[1]
        index = file_path.split('\\')[2]
        key = type+"\\"+index
        if (file_path.lower().endswith(".usdz")):
          usdz[key] = file_path
        else:
          if (key in photos.keys()):
            photos[key].append(file_path)
          else:
            photos[key] = [file_path]

  bucket = storage.bucket()
  for key,image_paths in photos.items():
    hasher = hashlib.sha1()
    hasher.update(key.strip().encode('utf-8'))
    type = key.split('\\')[0]
    index = key.split('\\')[1]
    imgs = []
    carousel_img = ''
    # upload images
    for image in image_paths:
      print("Uploading: "+image)
      blob = bucket.blob(image)
      blob.upload_from_filename(image)
      blob.make_public()
      if(image.endswith("cover_image.jpg")):
        carousel_img = blob.public_url
      else:
        imgs.append(blob.public_url)
    # upload usdz
    print("Uploading: "+usdz[key])
    blob = bucket.blob(usdz[key])
    blob.upload_from_filename(usdz[key])
    blob.make_public()
    titleAndPriceAndDiscount = prices[str(type)][str(index)]
    ast = asset(hasher.hexdigest(),titleAndPriceAndDiscount.title,getTags(type),imgs,titleAndPriceAndDiscount.price,
          getCoverImage(type,imgs,carousel_img),blob.public_url,titleAndPriceAndDiscount.discount)
    assets.append(ast)

  for asset in assets:
    print("Adding product:",asset.title)
    imgs = {}
    for img in asset.images:
      imgs[len(imgs)] = img
    
    tags = asset.tags[0]
    for i in range(1,len(asset.tags)):
      tags+= "#"+asset.tags[i]

    db.reference().child('products').child(asset.key).update({
      'title':asset.title,
      'price':asset.price,
      'tag':tags,
      'images':imgs,
      'cover_image':asset.cover_image,
      'qr':asset.qr_code,
      'discount':asset.discount
    })
