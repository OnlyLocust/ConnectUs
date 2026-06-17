export default function mongoSanitize(req, res, next) {
  const sanitize = (v) => {
    if (v && typeof v === "object") {
      for (const key in v) {
        if (Object.prototype.hasOwnProperty.call(v, key)) {
          if (key.startsWith("$") || key.includes(".")) {
            delete v[key];
          } else {
            sanitize(v[key]);
          }
        }
      }
    }
    return v;
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.headers) sanitize(req.headers);
  if (req.query) sanitize(req.query);

  next();
}
