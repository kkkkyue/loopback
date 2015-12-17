/**
 * Module Dependencies.
 */

var assert = require('assert');

/**
 * Checkpoint list entry.
 *
 * @property id {Number} the sequencial identifier of a checkpoint
 * @property time {Number} the time when the checkpoint was created
 * @property sourceId {String}  the source identifier
 *
 * @class Checkpoint
 * @inherits {PersistedModel}
 */

module.exports = function(Checkpoint) {

  // Workaround for https://github.com/strongloop/loopback/issues/292
  Checkpoint.definition.rawProperties.time.default =
    Checkpoint.definition.properties.time.default = function() {
      return new Date();
    };

  /**
   * Get the current checkpoint id
   * @callback {Function} callback
   * @param {Error} err
   * @param {Number} checkpointId The current checkpoint id
   */
  Checkpoint.current = function(cb) {
    var Checkpoint = this;
    this.findOne(function(err, cp) {
      if (err) return cb(err);
      if (cp) {
        cb(null, cp.seq);
      } else {
        Checkpoint.create({ seq: 1 }, function(err, data) {
          if (err) return cb(err);
          cb(null, data.seq);
        });
      }
    });
  };

  Checkpoint.bump = function(cb){
    this.findOne(function(err, cp){
      if(err)
        return cb(err, null);
      if (cp){
        cp.seq++;
      } else {
        cp = new Checkpoint({seq: 1});     
      }
      cp.save(cb);
    })
  }
};
