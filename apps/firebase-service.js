/* Servico de leitura do Firestore usado pelo frontend TermoLogic. */
(function (global) {
  'use strict';

  function connect(firebaseConfig) {
    if (!global.firebase || !global.firebase.firestore) {
      throw new Error('SDK do Firebase/Firestore nao foi carregado.');
    }

    const app = global.firebase.apps.length
      ? global.firebase.apps[0]
      : global.firebase.initializeApp(firebaseConfig);

    return app.firestore();
  }

  function subscribeCollection(db, collectionName, onDocuments, onError) {
    if (!db) throw new Error('A conexao com o Firestore nao foi inicializada.');
    if (!collectionName || typeof collectionName !== 'string') {
      throw new Error('Informe o nome da colecao do Firestore.');
    }

    let changeSequence = 0;
    const liveOrderById = new Map();

    return db.collection(collectionName).onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          changeSequence += 1;
          if (change.type === 'removed') {
            liveOrderById.delete(change.doc.id);
          } else {
            liveOrderById.set(change.doc.id, changeSequence);
          }
        });

        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          __liveOrder: liveOrderById.get(doc.id) || 0
        }));
        onDocuments(documents);
      },
      onError
    );
  }

  global.TermologicFirebase = Object.freeze({ connect, subscribeCollection });
})(window);
