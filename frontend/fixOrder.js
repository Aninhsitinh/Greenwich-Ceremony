const fs = require('fs');
let c = fs.readFileSync('src/views/student/BookingConfirmation.vue', 'utf8');

c = c.replace(/if \(\!transactionId\.value\) \{\s*transactionId\.value = 'TXN' \+ Date\.now\(\)\.toString\(\)\.slice\(-10\);\s*\}/, `if (!transactionId.value) {
        let storedTxn = localStorage.getItem('current_txn_id');
        if (!storedTxn) {
            storedTxn = 'TXN-' + (authStore.user?.studentId || Date.now().toString().slice(-8));
            localStorage.setItem('current_txn_id', storedTxn);
        }
        transactionId.value = storedTxn;
    }`);

c = c.replace(/\} else if \(\!transactionId\.value\) \{\s*\/\/ Initialize new if not present\s*transactionId\.value = 'TXN' \+ Date\.now\(\)\.toString\(\)\.slice\(-10\);\s*\}/, `} else if (!transactionId.value) {
     let storedTxn = localStorage.getItem('current_txn_id');
     if (!storedTxn) {
         storedTxn = 'TXN-' + (authStore.user?.studentId || Date.now().toString().slice(-8));
         localStorage.setItem('current_txn_id', storedTxn);
     }
     transactionId.value = storedTxn;
  }`);

c = c.replace(/if \(route\.query\.status === 'success' && route\.query\.transactionId\) \{\s*paymentCompleted\.value = true;\s*\}/, `if (route.query.status === 'success' && route.query.transactionId) {
     paymentCompleted.value = true;
     localStorage.removeItem('current_txn_id');
  }`);

fs.writeFileSync('src/views/student/BookingConfirmation.vue', c);
