const {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  deleteDoc,
} = require("firebase/firestore");

const { db } = require("./../firebase/config.js");
async function cleanCodes() {
  const codesSnap = await getDoc(doc(db, "cached", "grc"));
  if (codesSnap.exists()) {
    let codes = codesSnap.data().codes;
    let updated = [];
    for (let i = 0; i < codes.length; i++) {
      if (codes[i].code == undefined) {
        console.log(codes[i]);
        continue;
      }
      updated.push(codes[i]);
    }
    await setDoc(doc(db, "cached", "grc"), { codes: updated });
  }
}

async function withdraw(req, res) {
  cleanCodes();

  console.log("Step 1");
  const { uid, amount } = req.body;
  const userSnap = await getDoc(doc(db, "users", uid));
  if (userSnap.exists()) {
    console.log("Step 2");
    const user = userSnap.data();
    if (amount < 200) {
      return res.json({
        status: "error",
        message: "Require minimum balance to redeem",
      });
    }
    if (user.coinsGenerated < amount) {
      return res.json({ status: "error", message: "Insufficient balance" });
    }
    const inrBalance = amount * 0.05;
    // Update user balance
    const newBalance = user.coinsGenerated - amount;
    let newUser = { ...user, coinsGenerated: newBalance };

    // Fetch coins data..
    const codesSnap = await getDoc(doc(db, "cached", "grc"));
    if (codesSnap.exists()) {
      console.log("Step 3");
      let codes = codesSnap.data().codes;
      let redeemCodesAmount = inrBalance / 10;
      let redeemCodes = [];
      let codeFound = 0;
      for (let i = 0; i < codes.length; i++) {
        if (redeemCodes.length < redeemCodesAmount) {
          if (codes[i].status == "unused") {
            codeFound++;
            redeemCodes.push({
              code: codes[i].code,
              createdAt: new Date().toDateString(),
            });
            codes[i].status = "used";
          }
        }
      }
      if (codeFound < redeemCodesAmount)
        return res.json({
          status: "error",
          message:
            "Redeem Code Under Maintenance, Please Try After Sometime. Sorry for Inconvenience",
        });
      // Update user account

      const transaction = {
        createdBy: uid,
        amount: inrBalance,
        coinsAmount: amount,
        redeemCodeDetails: redeemCodes,
      };

      // if (redeemCodes.length == inrBalance / 10) {
      // Update codes list..
      console.log("Step 4");
      newUser.redeemRequests = [...redeemCodes, ...newUser.redeemRequests];
      console.log("New user:", newUser);
      await setDoc(doc(db, "users", uid), newUser);
      console.log("User set :) ");
      await setDoc(doc(db, "cached", "grc"), { codes });
      console.log("Codes set :)");
      await setDoc(
        doc(db, "transactions", new Date().toISOString()),
        transaction
      );
      console.log("Transactions Set:)");
      return res.json({
        status: "success",
        message: "Withdrawal successful",
        redeemCodes,
      });
      // } else {
      //   await setDoc(doc(db, "users", uid), {
      //     coinsGenerated: amount + newUser.coinsGenerated,
      //     ...newUser,
      //   });
      //   return res.json({ status: "error", message: "Insufficient Amount" });
      // }
    }
  }
}

module.exports = { withdraw };
