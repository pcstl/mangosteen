var UniqueGen = function() {
  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowercase = "abcdefghijklmnopqrtuvwxyz";
  var symbols = "$_";
  var numbers = "1234567890";

  this._registeredIdentifiers = [];
  this._allowedCharacters = uppercase + lowercase + symbols + numbers;
};

UniqueGen.prototype._nextStr = function(s) {
  if(s.charAt(s.length - 1)
     === this._allowedCharacters.charAt(this._allowedCharacters.length - 1)) {
    return s + this._allowedCharacters.charAt(0);
  } else {
    var lastChar = s.charAt(s.length - 1);
    var index = this._allowedCharacters.indexOf(lastChar);

    return s.substring(0, s.length - 1)
      + this._allowedCharacters.charAt(index + 1);
  }
};

UniqueGen.prototype._checkCollisions = function(ids, str) {
  return ids.filter(function(x) {
    if(typeof x === "string") {
      return x.startsWith(str);
    } else {
      return false;
    }
  });
};

UniqueGen.prototype.generate = function() {
  var prefix = "$$" + this._allowedCharacters.charAt(0);

  var possibleCollisions = this._registeredIdentifiers.slice(0);
  var nextPrefix = prefix;
  
  do {
    prefix = nextPrefix;
    var collisions = this._checkCollisions(possibleCollisions, prefix);

    nextPrefix = this._nextStr(prefix);
  } while(collisions.length > 0);

  this._registeredIdentifiers.push(prefix);
  return prefix;
};

UniqueGen.prototype.generateFrom = function(str) {
  var suffix = "_" + this._allowedCharacters.charAt(0);
  
  var possibleCollisions = this._registeredIdentifiers.slice(0);
  var nextSuffix = suffix;
  do {
    suffix = nextSuffix;
    var collisions = this._checkCollisions(possibleCollisions, str + suffix);

    nextSuffix = this._nextStr(suffix);
  } while(collisions.length > 0);

  this._registeredIdentifiers.push(str + suffix);
  return str + suffix;
};

UniqueGen.prototype.registerIdentifiers = function(ids) {
  if(typeof ids === "object") {
    if(Array.isArray(ids)) {
      this._registeredIdentifiers = this._registeredIdentifiers.concat(ids);
    }
  } else if(typeof ids === "string") {
    this._registeredIdentifiers.push(ids);
  }
};


module.exports = {
  UniqueGen: UniqueGen,
  default: UniqueGen
};
