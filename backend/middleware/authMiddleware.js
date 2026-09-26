const jwt = require('jsonwebtoken');

// এই ফাংশনটা প্রতিটা "সুরক্ষিত" request-এর আগে চেক করবে
const authMiddleware = (req, res, next) => {
  // Header থেকে token বের করা
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'অনুমতি নেই, লগইন করুন' });
  }

  // "Bearer eyJhbGci..." থেকে শুধু token অংশটা আলাদা করা
  const token = authHeader.split(' ')[1];

  try {
    // token যাচাই করা - এটা কি আসল, নাকি ভুয়া/মেয়াদ শেষ
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ইউজারের তথ্য request-এর সাথে যুক্ত করে দেওয়া, যাতে পরের কোড এটা ব্যবহার করতে পারে
    req.user = decoded;

    // সব ঠিক থাকলে, পরের ধাপে (আসল route-এর কোডে) যাওয়ার অনুমতি দেওয়া
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token ভুল বা মেয়াদ শেষ হয়ে গেছে' });
  }
};

module.exports = authMiddleware;
