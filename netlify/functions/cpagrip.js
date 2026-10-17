const FIREBASE_DB_URL = "https://pocketplay-40791-default-rtdb.firebaseio.com";
const DB_SECRET = "4CCAYcqgVdcPmCLvyIzMp0aEolJBQoeorBygHRtJ"; // जो Firebase से Database Secret कॉपी किया था
const POSTBACK_PASSWORD = "PocketPlay@2026";
const POINTS_PER_DOLLAR = 1600; // $1 = 1600 पॉइंट्स (₹1 = 20 पॉइंट्स)
const REFERRAL_PERCENT = 10;    // रेफर करने वाले को 10% बोनस

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const { user_id, payout, password } = params;

  if (password !== POSTBACK_PASSWORD) {
    return { statusCode: 403, body: "Unauthorized" };
  }

  if (!user_id || !payout) {
    return { statusCode: 400, body: "Missing parameters" };
  }

  const dollarEarned = parseFloat(payout) || 0;
  const pointsToAdd = Math.floor(dollarEarned * POINTS_PER_DOLLAR);

  if (pointsToAdd <= 0) {
    return { statusCode: 200, body: "OK" };
  }

  try {
    // 1. टास्क करने वाले यूज़र का डेटा पढ़ें
    const userUrl = `${FIREBASE_DB_URL}/users/${user_id}.json?auth=${DB_SECRET}`;
    const userRes = await fetch(userUrl);
    const userData = await userRes.json();

    if (!userData) {
      return { statusCode: 404, body: "User not found" };
    }

    // 2. यूज़र के पॉइंट्स अपडेट करें
    const newPoints = (userData.points || 0) + pointsToAdd;
    await fetch(userUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: newPoints }),
    });

    // 3. रेफरल बोनस अपडेट करें (यदि यूज़र किसी के रेफर कोड से जुड़ा है)
    if (userData.referCode) {
      const allUsersUrl = `${FIREBASE_DB_URL}/users.json?auth=${DB_SECRET}`;
      const allUsersRes = await fetch(allUsersUrl);
      const allUsers = await allUsersRes.json();

      if (allUsers) {
        for (const uid in allUsers) {
          if (uid !== user_id && allUsers[uid].referCode === userData.referCode) {
            const refBonus = Math.floor((pointsToAdd * REFERRAL_PERCENT) / 100);
            if (refBonus > 0) {
              const refNewPoints = (allUsers[uid].points || 0) + refBonus;
              await fetch(`${FIREBASE_DB_URL}/users/${uid}.json?auth=${DB_SECRET}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ points: refNewPoints }),
              });
            }
            break;
          }
        }
      }
    }

    return { statusCode: 200, body: "OK" };
  } catch (err) {
    return { statusCode: 500, body: "Server Error" };
  }
};
