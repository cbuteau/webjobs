define('src/IdGenerator', [], function() {

  var instance = null;

  function getId() {
    return '' + Math.random().toString(36).substr(2, 9);
  }

  class IdGenerator {
    constructor() {
        this.ids = [];
    }

    generate() {
      var id = getId();
      while (this.ids.indexOf(id) !== -1) {
        id = getId();
      }

      this.ids.push(id);

      return id;
    }
  }


  if (!instance) {
    instance = new IdGenerator();
  }
  return instance;
});
