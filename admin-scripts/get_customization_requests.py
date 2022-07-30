from firebase_admin import credentials,db
import firebase_admin
import xlwt
from xlwt import Workbook
from datetime import date

firebase_admin.initialize_app(credentials.Certificate('config/secret.json'),{
  'apiKey': "AIzaSyBAOPIC2uWoC8ri28k3mKlE60YjDs19tLY",
  'authDomain': "urbanlogs-93ca7.firebaseapp.com",
  'databaseURL': "https://urbanlogs-93ca7-default-rtdb.firebaseio.com",
  'projectId': "urbanlogs-93ca7",
  'storageBucket': "urbanlogs-93ca7.appspot.com",
  'messagingSenderId': "958392069971",
  'appId': "1:958392069971:web:b1a7f6aa67abc7d24c3ba6"
})

if __name__ == '__main__':
    requests = []
    customization_requests = db.reference().child('customization-requests').get()
    print("\n\nCUSTOMIZATION REQUESTS")
    print("1. New Requests")
    print("2. All Requests")
    try:
      req_type = int(input("\nEnter request type (1/2): "))
      if req_type == 1:
        for key,request in customization_requests.items():
          if request['read'] == False:
            requests.append(request)
            db.reference().child('customization-requests').child(key).child('read').set(True)
      elif req_type == 2:
        for key,request in customization_requests.items():
          requests.append(request)
      else:
        print("Invalid request type")
      if len(requests) > 0:
        print("\n"+str(len(requests)),"requests found. Generating excel sheet")
        wb = Workbook()
        today = date.today()
        sheet = wb.add_sheet(today.strftime("%b-%d-%Y"))
        sheet.write(0,0,"User Id")
        sheet.write(0,1,"Email Id")
        sheet.write(0,2,"Title")
        sheet.write(0,3,"Description")
        sheet.write(0,4,"Length")
        sheet.write(0,5,"Breadth")
        sheet.write(0,6,"Height")
        row = 1
        for req in requests:
          sheet.write(row,0,req["uid"])
          sheet.write(row,1,req["email"])
          sheet.write(row,2,req["title"])
          sheet.write(row,3,req["description"])
          sheet.write(row,4,req["dimension"]["length"])
          sheet.write(row,5,req["dimension"]["breadth"])
          sheet.write(row,6,req["dimension"]["height"])
          row+=1
        wb.save('results/Customization_Requests.xls')
        print("\nExcel sheet generated")
      else:
        print("\nNo new requests found")
    except Exception as e:
      print(e)
      print("Invalid input")