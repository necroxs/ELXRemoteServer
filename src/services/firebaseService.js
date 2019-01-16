module.exports = class firebaseService {
   
    firebaseService(){
        this.firestore = null;
    }
    connect(){
        const config = {
            apiKey: "AIzaSyCF6xxuYpAAGhY7E0eO8LKxpfem-fFN1u0",
            authDomain: "elxremote.firebaseapp.com",
            databaseURL: "https://elxremote.firebaseio.com",
            projectId: "elxremote",
            storageBucket: "elxremote.appspot.com",
            messagingSenderId: "699470534935",
            
          };
        firebase.initializeApp(config);
        const settings = { timestampsInSnapshots: true};
        var db =  firebase.firestore();
        db.settings(settings);
        this.firestore = db.collection('Victims');
       
   
    }
    add(data){
        return this.firestore.add(data);
    }
    update(id,data){
        return this.firestore.doc(id).set(data);
    }
    getAll(){
        this.firestore.get().then((querySnapshot) => {
            console.log(querySnapshot);
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
            });
        });
    }
    get(id){
        return this.firestore.doc(id).get();
    }
    delete(id){
        return this.firestore.doc(id).delete();
    }

    
     
}
