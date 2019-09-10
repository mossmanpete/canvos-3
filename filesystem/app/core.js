class Event {

  constructor(name, func) {
    this.name = name;
    this.func = func;
  }

  Run(...p) {
    this.func(...p);
  }

}

class EventArray {

  constructor(events) {
    this.events = events !== undefined ? events : [];
  }

  Run(...p) {
    for (e of this.events) {
      e.Run(...p);
    }
  }

  Register(e) {
    this.events.push(e);
  }

  UnRegister(v) {
    var data = this.events;
    if (typeof v === "string") {
      for (var i = 0, imax = this.events.length; i < imax; i++) {
        if (data[i].name === v) {
          this.events.splice(i, 1);
          return true;
        }
      }
      return false;
    } else {
      for (var i = 0, imax = this.events.length; i < imax; i++) {
        if (data[i] === v) {
          this.events.splice(i, 1);
          return true;
        }
      }
      return false;
    }
  }

}

class File {

  constructor(data) {
    this.data = data !== undefined ? data : "";
    this.onwrite = new EventArray();
    this.onread = new EventArray();
  }

  async read(pos, amt, options) {
    var out = "";
    if (pos > this.data.length) pos = this.data.length;
    this.onread.Run(pos, amt);
    var currentPromise = undefined;
    var readEvent = new Event("_file_tempread", (pos, amt) => {
      currentPromise();
    });
    this.onwrite.Register(readEvent);
    for (var i = 0, imax = amt; i < imax; i++) {
      var d = this.data.slice(pos + i);
      if (d.length == 0)
        if (!options || options.wait)
          await new Promise(yey => currentPromise = yey);
      else
        out += d[0];
        if (options && options.noinc) pos--;
    }
    this.onwrite.UnRegister("_file_tempread");
    return out;
  }

  write(pos, chars, options) {
    if (pos > this.data.length) pos = this.data.length;
    data = data.slice(0, pos) + chars + a.slice(pos, a.length);
    this.onwrite.Run(pos, amt);
  }

}
