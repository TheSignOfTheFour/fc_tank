var Animations, BinomialHeap, BinomialHeapNode, BrickTerrain, ClockGift, Commander, Direction, EnemyAICommander, EnemyTank, FishTank, FoolTank, Game, GameScene, Gift, GrassTerrain, GunGift, HatGift, HiScoreScene, HomeTerrain, IceTerrain, IronTerrain, LandMineGift, LifeGift, Map2D, MapArea2D, MapArea2DVertex, MapUnit2D, Missile, MissileCommander, MovableMapUnit2D, OnlineGamesScene, Point, ReportScene, Scene, ShipGift, ShovelGift, StageScene, StarGift, StrongTank, StupidTank, Tank, Terrain, TiledMapBuilder, UserCommander, UserP1Tank, UserP2Tank, UserTank, WaterTerrain, WelcomeScene,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

BinomialHeapNode = (function() {
  function BinomialHeapNode(satellite, key) {
    this.satellite = satellite;
    this.key = key;
    this.parent = null;
    this.degree = 0;
    this.child = null;
    this.sibling = null;
    this.prev_sibling = null;
  }

  BinomialHeapNode.prototype.link = function(node) {
    this.parent = node;
    this.sibling = node.child;
    if (this.sibling !== null) {
      this.sibling.prev_sibling = this;
    }
    this.prev_sibling = null;
    node.child = this;
    return node.degree += 1;
  };

  BinomialHeapNode.prototype.is_head = function() {
    return this.parent === null && this.prev_sibling === null;
  };

  BinomialHeapNode.prototype.is_first_child = function() {
    return this.parent !== null && this.prev_sibling === null;
  };

  return BinomialHeapNode;

})();

BinomialHeap = (function() {
  function BinomialHeap(head) {
    this.head = head != null ? head : null;
  }

  BinomialHeap.prototype.is_empty = function() {
    return this.head === null;
  };

  BinomialHeap.prototype.insert = function(node) {
    return this.union(new BinomialHeap(node));
  };

  BinomialHeap.prototype.min = function() {
    var min, x, y;
    y = null;
    x = this.head;
    min = Infinity;
    while (x !== null) {
      if (x.key < min) {
        min = x.key;
        y = x;
      }
      x = x.sibling;
    }
    return y;
  };

  BinomialHeap.prototype._extract_min_root_node = function() {
    var curr, min, _ref, _ref1;
    _ref = [this.head, this.head], curr = _ref[0], min = _ref[1];
    while (curr !== null) {
      if (curr.key < min.key) {
        min = curr;
      }
      curr = curr.sibling;
    }
    if (min.is_head()) {
      this.head = min.sibling;
    } else {
      min.prev_sibling.sibling = min.sibling;
    }
    if (min.sibling !== null) {
      min.sibling.prev_sibling = min.prev_sibling;
    }
    _ref1 = [null, null], min.sibling = _ref1[0], min.prev_sibling = _ref1[1];
    return min;
  };

  BinomialHeap.prototype.extract_min = function() {
    var curr, min, _ref;
    if (this.is_empty()) {
      return null;
    }
    min = this._extract_min_root_node();
    curr = min.child;
    if (curr !== null) {
      while (curr !== null) {
        _ref = [curr.sibling, curr.prev_sibling, null], curr.prev_sibling = _ref[0], curr.sibling = _ref[1], curr.parent = _ref[2];
        if (curr.is_head()) {
          this.union(new BinomialHeap(curr));
        }
        curr = curr.prev_sibling;
      }
    }
    min.parent = null;
    min.child = null;
    min.degree = 0;
    return min;
  };

  BinomialHeap.prototype.union = function(heap) {
    var next_x, prev_x, x;
    this.merge(heap);
    if (this.is_empty()) {
      return;
    }
    prev_x = null;
    x = this.head;
    next_x = x.sibling;
    while (next_x !== null) {
      if (x.degree !== next_x.degree || (next_x.sibling !== null && next_x.sibling.degree === x.degree)) {
        prev_x = x;
        x = next_x;
      } else if (x.key <= next_x.key) {
        x.sibling = next_x.sibling;
        if (x.sibling !== null) {
          x.sibling.prev_sibling = x;
        }
        next_x.link(x);
      } else {
        if (prev_x === null) {
          this.head = next_x;
          this.head.prev_sibling = null;
        } else {
          prev_x.sibling = next_x;
          if (prev_x.sibling !== null) {
            prev_x.sibling.prev_sibling = prev_x;
          }
        }
        x.link(next_x);
      }
      next_x = x.sibling;
    }
    return this;
  };

  BinomialHeap.prototype.decrease_key = function(node, new_key) {
    var child, y, z, _ref, _ref1, _ref2, _ref3, _ref4, _results;
    if (new_key > node.key) {
      throw new Error("new key is greater than current key");
    }
    node.key = new_key;
    y = node;
    z = y.parent;
    _results = [];
    while (z !== null && y.key < z.key) {
      if (y.is_first_child()) {
        y.parent.child = z;
      }
      if (z.is_first_child()) {
        z.parent.child = y;
      }
      _ref = [z.parent, y.parent], y.parent = _ref[0], z.parent = _ref[1];
      if (y.prev_sibling !== null) {
        y.prev_sibling.sibling = z;
      }
      if (z.prev_sibling !== null) {
        z.prev_sibling.sibling = y;
      }
      _ref1 = [z.prev_sibling, y.prev_sibling], y.prev_sibling = _ref1[0], z.prev_sibling = _ref1[1];
      if (y.sibling !== null) {
        y.sibling.prev_sibling = z;
      }
      if (z.sibling !== null) {
        z.sibling.prev_sibling = y;
      }
      _ref2 = [z.sibling, y.sibling], y.sibling = _ref2[0], z.sibling = _ref2[1];
      child = y.child;
      while (child !== null) {
        child.parent = z;
        child = child.sibling;
      }
      child = z.child;
      while (child !== null) {
        child.parent = y;
        child = child.sibling;
      }
      _ref3 = [z.child, y.child], y.child = _ref3[0], z.child = _ref3[1];
      _ref4 = [z.degree, y.degree], y.degree = _ref4[0], z.degree = _ref4[1];
      if (y.is_head()) {
        this.head = y;
      }
      _results.push(z = y.parent);
    }
    return _results;
  };

  BinomialHeap.prototype["delete"] = function(node) {
    this.decrease_key(node, -Infinity);
    return this.extract_min();
  };

  BinomialHeap.prototype.merge = function(heap) {
    var curr, p1, p2;
    if (heap.is_empty()) {
      return;
    }
    if (this.is_empty()) {
      this.head = heap.head;
      return;
    }
    p1 = this.head;
    p2 = heap.head;
    if (p1.degree < p2.degree) {
      this.head = p1;
      p1 = p1.sibling;
    } else {
      this.head = p2;
      p2 = p2.sibling;
    }
    curr = this.head;
    while (p1 !== null || p2 !== null) {
      if (p1 === null) {
        curr.sibling = p2;
        if (p2 !== null) {
          p2.prev_sibling = curr;
        }
        break;
      } else if (p2 === null) {
        curr.sibling = p1;
        if (p1 !== null) {
          p1.prev_sibling = curr;
        }
        break;
      } else if (p1.degree < p2.degree) {
        curr.sibling = p1;
        p1.prev_sibling = curr;
        curr = p1;
        p1 = p1.sibling;
      } else {
        curr.sibling = p2;
        p2.prev_sibling = curr;
        curr = p2;
        p2 = p2.sibling;
      }
    }
    return this;
  };

  return BinomialHeap;

})();

$(function() {
  var game;
  game = new Game();
  window.game = game;
  return game.kick_off();
});

Direction = (function() {
  function Direction() {}

  Direction.UP = 0;

  Direction.DOWN = 180;

  Direction.LEFT = 270;

  Direction.RIGHT = 90;

  Direction.all = function() {
    return [this.UP, this.DOWN, this.LEFT, this.RIGHT];
  };

  return Direction;

})();

Animations = (function() {
  function Animations() {}

  Animations.movables = {
    bom: [
      {
        x: 360,
        y: 340,
        width: 40,
        height: 40
      }, {
        x: 120,
        y: 340,
        width: 40,
        height: 40
      }, {
        x: 160,
        y: 340,
        width: 40,
        height: 40
      }, {
        x: 200,
        y: 340,
        width: 40,
        height: 40
      }
    ],
    tank_born: [
      {
        x: 360,
        y: 340,
        width: 40,
        height: 40
      }, {
        x: 0,
        y: 340,
        width: 40,
        height: 40
      }, {
        x: 40,
        y: 340,
        width: 40,
        height: 40
      }, {
        x: 0,
        y: 340,
        width: 40,
        height: 40
      }, {
        x: 80,
        y: 340,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv1: [
      {
        x: 0,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv1_frozen: [
      {
        x: 0,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 0,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 320,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv1_with_ship: [
      {
        x: 40,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv1_with_guard: [
      {
        x: 0,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 80,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv2: [
      {
        x: 120,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv2_frozen: [
      {
        x: 120,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 120,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 320,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv2_with_ship: [
      {
        x: 160,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv2_with_guard: [
      {
        x: 120,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 200,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv3: [
      {
        x: 240,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv3_frozen: [
      {
        x: 240,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 240,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 320,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv3_with_ship: [
      {
        x: 280,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p1_lv3_with_guard: [
      {
        x: 240,
        y: 0,
        width: 40,
        height: 40
      }, {
        x: 320,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv1: [
      {
        x: 0,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv1_frozen: [
      {
        x: 0,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 0,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 320,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv1_with_ship: [
      {
        x: 40,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv1_with_guard: [
      {
        x: 0,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 80,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv2: [
      {
        x: 120,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv2_frozen: [
      {
        x: 120,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 120,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 320,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv2_with_ship: [
      {
        x: 160,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv2_with_guard: [
      {
        x: 120,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 200,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv3: [
      {
        x: 240,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv3_frozen: [
      {
        x: 240,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 240,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 320,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv3_with_ship: [
      {
        x: 280,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    user_p2_lv3_with_guard: [
      {
        x: 240,
        y: 40,
        width: 40,
        height: 40
      }, {
        x: 320,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    enemy_lv3: [
      {
        x: 360,
        y: 0,
        width: 40,
        height: 40
      }
    ],
    enemy_lv3_with_ship: [
      {
        x: 360,
        y: 40,
        width: 40,
        height: 40
      }
    ],
    stupid_hp1: [
      {
        x: 0,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_hp1_with_ship: [
      {
        x: 40,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_hp2: [
      {
        x: 80,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_hp2_with_ship: [
      {
        x: 120,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_hp3: [
      {
        x: 160,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_hp3_with_ship: [
      {
        x: 200,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_hp4: [
      {
        x: 240,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_hp4_with_ship: [
      {
        x: 280,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_with_gift: [
      {
        x: 320,
        y: 80,
        width: 40,
        height: 40
      }, {
        x: 320,
        y: 80,
        width: 40,
        height: 40
      }, {
        x: 0,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    stupid_with_gift_with_ship: [
      {
        x: 360,
        y: 80,
        width: 40,
        height: 40
      }, {
        x: 40,
        y: 80,
        width: 40,
        height: 40
      }
    ],
    fool_hp1: [
      {
        x: 0,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_hp1_with_ship: [
      {
        x: 40,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_hp2: [
      {
        x: 80,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_hp2_with_ship: [
      {
        x: 120,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_hp3: [
      {
        x: 160,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_hp3_with_ship: [
      {
        x: 200,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_hp4: [
      {
        x: 240,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_hp4_with_ship: [
      {
        x: 280,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_with_gift: [
      {
        x: 320,
        y: 120,
        width: 40,
        height: 40
      }, {
        x: 320,
        y: 120,
        width: 40,
        height: 40
      }, {
        x: 0,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fool_with_gift_with_ship: [
      {
        x: 360,
        y: 120,
        width: 40,
        height: 40
      }, {
        x: 40,
        y: 120,
        width: 40,
        height: 40
      }
    ],
    fish_hp1: [
      {
        x: 0,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_hp1_with_ship: [
      {
        x: 40,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_hp2: [
      {
        x: 80,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_hp2_with_ship: [
      {
        x: 120,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_hp3: [
      {
        x: 160,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_hp3_with_ship: [
      {
        x: 200,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_hp4: [
      {
        x: 240,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_hp4_with_ship: [
      {
        x: 280,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_with_gift: [
      {
        x: 320,
        y: 160,
        width: 40,
        height: 40
      }, {
        x: 320,
        y: 160,
        width: 40,
        height: 40
      }, {
        x: 0,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    fish_with_gift_with_ship: [
      {
        x: 360,
        y: 160,
        width: 40,
        height: 40
      }, {
        x: 40,
        y: 160,
        width: 40,
        height: 40
      }
    ],
    strong_hp1: [
      {
        x: 0,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_hp1_with_ship: [
      {
        x: 40,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_hp2: [
      {
        x: 80,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_hp2_with_ship: [
      {
        x: 120,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_hp3: [
      {
        x: 160,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_hp3_with_ship: [
      {
        x: 200,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_hp4: [
      {
        x: 240,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_hp4_with_ship: [
      {
        x: 280,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_with_gift: [
      {
        x: 320,
        y: 200,
        width: 40,
        height: 40
      }, {
        x: 320,
        y: 200,
        width: 40,
        height: 40
      }, {
        x: 0,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    strong_with_gift_with_ship: [
      {
        x: 360,
        y: 200,
        width: 40,
        height: 40
      }, {
        x: 40,
        y: 200,
        width: 40,
        height: 40
      }
    ],
    missile: [
      {
        x: 250,
        y: 350,
        width: 20,
        height: 20
      }
    ]
  };

  Animations.movable = function(type) {
    return this.movables[type];
  };

  Animations.gifts = {
    land_mine: [
      {
        x: 0,
        y: 300,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 300,
        width: 40,
        height: 40
      }
    ],
    gun: [
      {
        x: 80,
        y: 300,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 300,
        width: 40,
        height: 40
      }
    ],
    ship: [
      {
        x: 40,
        y: 300,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 300,
        width: 40,
        height: 40
      }
    ],
    star: [
      {
        x: 160,
        y: 300,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 300,
        width: 40,
        height: 40
      }
    ],
    shovel: [
      {
        x: 120,
        y: 300,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 300,
        width: 40,
        height: 40
      }
    ],
    life: [
      {
        x: 240,
        y: 300,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 300,
        width: 40,
        height: 40
      }
    ],
    hat: [
      {
        x: 200,
        y: 300,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 300,
        width: 40,
        height: 40
      }
    ],
    clock: [
      {
        x: 280,
        y: 300,
        width: 40,
        height: 40
      }, {
        x: 360,
        y: 300,
        width: 40,
        height: 40
      }
    ]
  };

  Animations.rates = {
    bom: 12,
    tank_born: 7,
    user_p1_lv1: 1,
    user_p1_lv1_frozen: 0.5,
    user_p1_lv1_with_ship: 1,
    user_p1_lv1_with_guard: 4,
    user_p1_lv2: 1,
    user_p1_lv2_frozen: 1,
    user_p1_lv2_with_ship: 1,
    user_p1_lv2_with_guard: 4,
    user_p1_lv3: 1,
    user_p1_lv3_frozen: 1,
    user_p1_lv3_with_ship: 1,
    user_p1_lv3_with_guard: 4,
    user_p2_lv1: 1,
    user_p2_lv1_frozen: 1,
    user_p2_lv1_with_ship: 1,
    user_p2_lv1_with_guard: 4,
    user_p2_lv2: 1,
    user_p2_lv2_frozen: 1,
    user_p2_lv2_with_ship: 1,
    user_p2_lv2_with_guard: 4,
    user_p2_lv3: 1,
    user_p2_lv3_frozen: 1,
    user_p2_lv3_with_ship: 1,
    user_p2_lv3_with_guard: 4,
    enemy_lv3: 1,
    enemy_lv3_with_ship: 1,
    stupid_hp1: 1,
    stupid_hp1_with_ship: 1,
    stupid_hp2: 1,
    stupid_hp2_with_ship: 1,
    stupid_hp3: 1,
    stupid_hp3_with_ship: 1,
    stupid_hp4: 1,
    stupid_hp4_with_ship: 1,
    stupid_with_gift: 1,
    stupid_with_gift_with_ship: 1,
    fool_hp1: 1,
    fool_hp1_with_ship: 1,
    fool_hp2: 1,
    fool_hp2_with_ship: 1,
    fool_hp3: 1,
    fool_hp3_with_ship: 1,
    fool_hp4: 1,
    fool_hp4_with_ship: 1,
    fool_with_gift: 1,
    fool_with_gift_with_ship: 1,
    fish_hp1: 1,
    fish_hp1_with_ship: 1,
    fish_hp2: 1,
    fish_hp2_with_ship: 1,
    fish_hp3: 1,
    fish_hp3_with_ship: 1,
    fish_hp4: 1,
    fish_hp4_with_ship: 1,
    fish_with_gift: 1,
    fish_with_gift_with_ship: 1,
    strong_hp1: 1,
    strong_hp1_with_ship: 1,
    strong_hp2: 1,
    strong_hp2_with_ship: 1,
    strong_hp3: 1,
    strong_hp3_with_ship: 1,
    strong_hp4: 1,
    strong_hp4_with_ship: 1,
    strong_with_gift: 1,
    strong_with_gift_with_ship: 1,
    missile: 1,
    land_mine: 3,
    gun: 3,
    ship: 3,
    star: 3,
    shovel: 3,
    life: 3,
    hat: 3,
    clock: 3,
    brick: 1,
    iron: 1,
    water: 1,
    grass: 1,
    ice: 1,
    home: 1
  };

  Animations.rate = function(type) {
    return this.rates[type];
  };

  Animations.terrains = {
    brick: [
      {
        x: 0,
        y: 240,
        width: 40,
        height: 40
      }
    ],
    iron: [
      {
        x: 120,
        y: 240,
        width: 40,
        height: 40
      }
    ],
    water: [
      {
        x: 240,
        y: 240,
        width: 40,
        height: 40
      }
    ],
    ice: [
      {
        x: 60,
        y: 240,
        width: 40,
        height: 40
      }
    ],
    grass: [
      {
        x: 180,
        y: 240,
        width: 40,
        height: 40
      }
    ],
    home_origin: [
      {
        x: 320,
        y: 240,
        width: 40,
        height: 40
      }
    ],
    home_destroyed: [
      {
        x: 360,
        y: 240,
        width: 40,
        height: 40
      }
    ]
  };

  Animations.terrain = function(type) {
    return this.terrains[type];
  };

  return Animations;

})();

Game = (function() {
  function Game() {
    this.canvas = new Kinetic.Stage({
      container: 'canvas',
      width: 600,
      height: 520
    });
    this.init_default_config();
    this.scenes = {
      'welcome': new WelcomeScene(this),
      'stage': new StageScene(this),
      'game': new GameScene(this),
      'report': new ReportScene(this),
      'hi_score': new HiScoreScene(this),
      'online_games': new OnlineGamesScene(this)
    };
    this.current_scene = null;
  }

  Game.prototype.set_config = function(key, value) {
    return this.configs[key] = value;
  };

  Game.prototype.get_config = function(key) {
    return this.configs[key];
  };

  Game.prototype.init_default_config = function() {
    return this.configs = {
      fps: 60,
      players: 1,
      online_games: ['127.0.0.1', '234.22.34.3'],
      curr_menu_game: 0,
      current_stage: 1,
      stages: 50,
      stage_autostart: false,
      game_over: false,
      hi_score: 20000,
      p1_score: 0,
      p2_score: 0,
      p1_level: 1,
      p2_level: 1,
      p1_lives: 2,
      p2_lives: 2,
      p1_killed_enemies: [],
      p2_killed_enemies: [],
      score_for_stupid: 100,
      score_for_fish: 200,
      score_for_fool: 300,
      score_for_strong: 400,
      score_for_gift: 500,
      last_score: 0,
      enemies_per_stage: 20
    };
  };

  Game.prototype.kick_off = function() {
    return this.switch_scene('welcome');
  };

  Game.prototype.prev_stage = function() {
    return this.mod_stage(this.configs['current_stage'] - 1 + this.configs['stages']);
  };

  Game.prototype.next_stage = function() {
    return this.mod_stage(this.configs['current_stage'] + 1 + this.configs['stages']);
  };

  Game.prototype.mod_stage = function(next) {
    if (next % this.configs['stages'] === 0) {
      this.configs['current_stage'] = this.configs['stages'];
    } else {
      this.configs['current_stage'] = next % this.configs['stages'];
    }
    return this.configs['current_stage'];
  };

  Game.prototype.reset = function() {
    _.each(this.scenes, function(scene) {
      return scene.stop();
    });
    this.current_scene = null;
    this.init_default_config();
    return this.kick_off();
  };

  Game.prototype.switch_scene = function(type) {
    var target_scene;
    target_scene = this.scenes[type];
    if (!_.isEmpty(this.current_scene)) {
      this.current_scene.stop();
    }
    target_scene.start();
    return this.current_scene = target_scene;
  };

  return Game;

})();

Scene = (function() {
  function Scene(game) {
    this.game = game;
    this.layer = new Kinetic.Layer();
    this.game.canvas.add(this.layer);
    this.layer.hide();
  }

  Scene.prototype.start = function() {
    this.layer.show();
    return this.layer.draw();
  };

  Scene.prototype.stop = function() {
    return this.layer.hide();
  };

  return Scene;

})();

WelcomeScene = (function(_super) {
  __extends(WelcomeScene, _super);

  function WelcomeScene(game) {
    this.game = game;
    WelcomeScene.__super__.constructor.call(this, this.game);
    this.static_group = new Kinetic.Group();
    this.layer.add(this.static_group);
    this.init_statics();
    this.init_logo();
    this.init_user_selection();
    this.sound = new Howl({
      urls: ['data/intro.ogg', 'data/intro.mp3']
    });
  }

  WelcomeScene.prototype.start = function() {
    WelcomeScene.__super__.start.call(this);
    this.static_group.move({
      y: -300,
      x: 0
    });
    new Kinetic.Tween({
      node: this.static_group,
      duration: 1.5,
      y: 0,
      rotationDeg: 0,
      easing: Kinetic.Easings.Linear,
      onFinish: (function(_this) {
        return function() {
          _this.update_players();
          return _this.enable_selection_control();
        };
      })(this)
    }).play();
    return this.update_numbers();
  };

  WelcomeScene.prototype.stop = function() {
    WelcomeScene.__super__.stop.call(this);
    this.disable_selection_control();
    return this.prepare_for_game_scene();
  };

  WelcomeScene.prototype.update_numbers = function() {
    return this.numbers_label.setText(("I- " + (this.game.get_config('p1_score'))) + ("  II- " + (this.game.get_config('p2_score'))) + ("  HI- " + (this.game.get_config('hi_score'))));
  };

  WelcomeScene.prototype.prepare_for_game_scene = function() {
    this.game.set_config('game_over', false);
    this.game.set_config('stage_autostart', false);
    this.game.set_config('current_stage', 1);
    this.game.set_config('p1_score', 0);
    this.game.set_config('p2_score', 0);
    this.game.set_config('p1_lives', 2);
    this.game.set_config('p2_lives', 2);
    this.game.set_config('p1_level', 1);
    return this.game.set_config('p2_level', 1);
  };

  WelcomeScene.prototype.enable_selection_control = function() {
    return $(document).bind("keydown", (function(_this) {
      return function(event) {
        switch (event.which) {
          case 13:
            if (_this.game.get_config('players') === 3) {
              return _this.game.switch_scene('online_games');
            } else {
              return _this.game.switch_scene('stage');
            }
            break;
          case 32:
            return _this.toggle_players();
        }
      };
    })(this));
  };

  WelcomeScene.prototype.disable_selection_control = function() {
    return $(document).unbind("keydown");
  };

  WelcomeScene.prototype.toggle_players = function() {
    var new_select_position;
    if (this.game.get_config('players') === 3) {
      new_select_position = 1;
    } else {
      new_select_position = this.game.get_config('players') + 1;
    }
    this.game.set_config('players', new_select_position);
    return this.update_players();
  };

  WelcomeScene.prototype.update_players = function() {
    var players;
    players = this.game.get_config('players');
    this.select_tank.setAbsolutePosition({
      x: 170,
      y: 310 + players * 40
    });
    return this.layer.draw();
  };

  WelcomeScene.prototype.init_statics = function() {
    this.numbers_label = new Kinetic.Text({
      x: 40,
      y: 40,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: ("I- " + (this.game.get_config('p1_score'))) + ("  II- " + (this.game.get_config('p2_score'))) + ("  HI- " + (this.game.get_config('hi_score'))),
      fill: "#fff"
    });
    return this.static_group.add(this.numbers_label);
  };

  WelcomeScene.prototype.init_logo = function() {
    var animations, area, brick_sprite, image, _i, _len, _ref, _results;
    image = document.getElementById('tank_sprite');
    _ref = [new MapArea2D(80, 100, 120, 110), new MapArea2D(120, 100, 140, 110), new MapArea2D(100, 110, 120, 140), new MapArea2D(100, 140, 120, 170), new MapArea2D(170, 100, 200, 110), new MapArea2D(160, 110, 180, 120), new MapArea2D(190, 110, 210, 120), new MapArea2D(150, 120, 170, 140), new MapArea2D(150, 140, 170, 170), new MapArea2D(200, 120, 220, 140), new MapArea2D(200, 140, 220, 170), new MapArea2D(170, 140, 200, 150), new MapArea2D(230, 100, 250, 140), new MapArea2D(230, 140, 250, 170), new MapArea2D(250, 110, 260, 140), new MapArea2D(260, 120, 270, 150), new MapArea2D(270, 130, 280, 160), new MapArea2D(280, 100, 300, 140), new MapArea2D(280, 140, 300, 170), new MapArea2D(310, 100, 330, 140), new MapArea2D(310, 140, 330, 170), new MapArea2D(360, 100, 380, 110), new MapArea2D(350, 110, 370, 120), new MapArea2D(340, 120, 360, 130), new MapArea2D(330, 130, 350, 140), new MapArea2D(330, 140, 360, 150), new MapArea2D(340, 150, 370, 160), new MapArea2D(350, 160, 380, 170), new MapArea2D(440, 100, 490, 110), new MapArea2D(430, 110, 450, 120), new MapArea2D(480, 110, 500, 120), new MapArea2D(420, 120, 440, 130), new MapArea2D(420, 130, 440, 140), new MapArea2D(420, 140, 440, 150), new MapArea2D(430, 150, 450, 160), new MapArea2D(480, 150, 500, 160), new MapArea2D(440, 160, 490, 170), new MapArea2D(180, 210, 200, 220), new MapArea2D(170, 220, 200, 230), new MapArea2D(180, 230, 200, 250), new MapArea2D(180, 250, 200, 270), new MapArea2D(160, 270, 200, 280), new MapArea2D(200, 270, 220, 280), new MapArea2D(240, 210, 260, 220), new MapArea2D(260, 210, 290, 220), new MapArea2D(230, 220, 250, 240), new MapArea2D(280, 220, 300, 240), new MapArea2D(240, 240, 260, 250), new MapArea2D(260, 240, 300, 250), new MapArea2D(280, 250, 300, 260), new MapArea2D(270, 260, 290, 270), new MapArea2D(240, 270, 280, 280), new MapArea2D(320, 210, 340, 220), new MapArea2D(340, 210, 370, 220), new MapArea2D(310, 220, 330, 240), new MapArea2D(360, 220, 380, 240), new MapArea2D(320, 240, 340, 250), new MapArea2D(340, 240, 380, 250), new MapArea2D(360, 250, 380, 260), new MapArea2D(350, 260, 370, 270), new MapArea2D(320, 270, 360, 280), new MapArea2D(410, 210, 440, 220), new MapArea2D(400, 220, 410, 230), new MapArea2D(430, 220, 450, 230), new MapArea2D(390, 230, 410, 260), new MapArea2D(440, 230, 460, 260), new MapArea2D(400, 260, 420, 270), new MapArea2D(440, 260, 450, 270), new MapArea2D(410, 270, 440, 280)];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      area = _ref[_i];
      animations = Animations.terrain('brick');
      brick_sprite = new Kinetic.Sprite({
        x: area.x1,
        y: area.y1,
        image: image,
        animation: 'standing',
        animations: {
          standing: [animations[0].x, animations[0].y, area.width(), area.height()]
        },
        frameRate: 0,
        frameIndex: 0
      });
      animations = null;
      _results.push(this.static_group.add(brick_sprite));
    }
    return _results;
  };

  WelcomeScene.prototype.init_user_selection = function() {
    var image, tank_mov;
    this.static_group.add(new Kinetic.Text({
      x: 210,
      y: 340,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "1 PLAYER",
      fill: "#fff"
    }));
    this.static_group.add(new Kinetic.Text({
      x: 210,
      y: 380,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "2 PLAYERS",
      fill: "#fff"
    }));
    this.static_group.add(new Kinetic.Text({
      x: 210,
      y: 420,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "ONLINE GAMES",
      fill: "#fff"
    }));
    this.static_group.add(new Kinetic.Text({
      x: 210,
      y: 460,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "© BEN♥FENG",
      fill: "#fff"
    }));
    image = document.getElementById('tank_sprite');
    tank_mov = Animations.movables['user_p1_lv1'][0];
    this.select_tank = new Kinetic.Sprite({
      x: 170,
      y: 350,
      image: image,
      animation: 'user_p1_lv1',
      animations: {
        'user_p1_lv1': [tank_mov.x, tank_mov.y, tank_mov.width, tank_mov.height]
      },
      frameRate: Animations.rate('user_p1_lv1'),
      offset: {
        x: 20,
        y: 20
      },
      rotationDeg: 90,
      frameIndex: 0
    });
    tank_mov = null;
    this.static_group.add(this.select_tank);
    return this.select_tank.start();
  };

  return WelcomeScene;

})(Scene);

StageScene = (function(_super) {
  __extends(StageScene, _super);

  function StageScene(game) {
    this.game = game;
    StageScene.__super__.constructor.call(this, this.game);
    this.init_stage_nodes();
  }

  StageScene.prototype.start = function() {
    this.current_stage = this.game.get_config('current_stage');
    this.update_stage_label();
    if (this.game.get_config('stage_autostart')) {
      setTimeout(((function(_this) {
        return function() {
          return _this.game.switch_scene('game');
        };
      })(this)), 2000);
    } else {
      this.enable_stage_control();
    }
    return StageScene.__super__.start.call(this);
  };

  StageScene.prototype.stop = function() {
    this.disable_stage_control();
    this.prepare_for_game_scene();
    return StageScene.__super__.stop.call(this);
  };

  StageScene.prototype.prepare_for_game_scene = function() {
    this.game.set_config('p1_killed_enemies', []);
    return this.game.set_config('p2_killed_enemies', []);
  };

  StageScene.prototype.enable_stage_control = function() {
    return $(document).bind("keydown", (function(_this) {
      return function(event) {
        switch (event.which) {
          case 37:
          case 38:
            _this.current_stage = _this.game.prev_stage();
            _this.update_stage_label();
            break;
          case 39:
          case 40:
            _this.current_stage = _this.game.next_stage();
            _this.update_stage_label();
            break;
          case 13:
            _this.game.switch_scene('game');
        }
        return false;
      };
    })(this));
  };

  StageScene.prototype.disable_stage_control = function() {
    return $(document).unbind("keydown");
  };

  StageScene.prototype.init_stage_nodes = function() {
    this.layer.add(new Kinetic.Rect({
      x: 0,
      y: 0,
      fill: "#999",
      width: 600,
      height: 520
    }));
    this.stage_label = new Kinetic.Text({
      x: 250,
      y: 230,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "STAGE " + this.current_stage,
      fill: "#333"
    });
    return this.layer.add(this.stage_label);
  };

  StageScene.prototype.update_stage_label = function() {
    this.stage_label.setText("STAGE " + this.current_stage);
    return this.layer.draw();
  };

  return StageScene;

})(Scene);

ReportScene = (function(_super) {
  __extends(ReportScene, _super);

  function ReportScene(game) {
    this.game = game;
    ReportScene.__super__.constructor.call(this, this.game);
    this.p1_number_labels = {};
    this.p2_number_labels = {};
    this.init_scene();
  }

  ReportScene.prototype.start = function() {
    ReportScene.__super__.start.call(this);
    this.update_numbers();
    return setTimeout((function(_this) {
      return function() {
        if (_this.game.get_config('game_over')) {
          return _this.game.switch_scene('welcome');
        } else {
          _this.game.set_config('stage_autostart', true);
          return _this.game.switch_scene('stage');
        }
      };
    })(this), 5000);
  };

  ReportScene.prototype.stop = function() {
    return ReportScene.__super__.stop.call(this);
  };

  ReportScene.prototype.update_numbers = function() {
    var number, p1_final_score, p1_kills, p1_numbers, p2_final_score, p2_kills, p2_numbers, tank;
    if (this.game.get_config('players') === 1) {
      this.p2_group.show();
    }
    p1_kills = this.game.get_config('p1_killed_enemies');
    p1_numbers = {
      stupid: 0,
      stupid_pts: 0,
      fish: 0,
      fish_pts: 0,
      fool: 0,
      fool_pts: 0,
      strong: 0,
      strong_pts: 0,
      total: 0,
      total_pts: 0
    };
    p2_numbers = _.cloneDeep(p1_numbers);
    _.each(p1_kills, (function(_this) {
      return function(type) {
        p1_numbers[type] += 1;
        p1_numbers["" + type + "_pts"] += _this.game.get_config("score_for_" + type);
        p1_numbers['total'] += 1;
        return p1_numbers['total_pts'] += _this.game.get_config("score_for_" + type);
      };
    })(this));
    p2_kills = this.game.get_config('p2_killed_enemies');
    _.each(p2_kills, function(type) {
      p2_numbers[type] += 1;
      p2_numbers["" + type + "_pts"] += this.game.get_config("score_for_" + type);
      p2_numbers['total'] += 1;
      return p2_numbers['total_pts'] += this.game.get_config("score_for_" + type);
    });
    for (tank in p1_numbers) {
      number = p1_numbers[tank];
      if (tank !== 'total_pts') {
        this.p1_number_labels[tank].setText(number);
      }
    }
    for (tank in p2_numbers) {
      number = p2_numbers[tank];
      if (tank !== 'total_pts') {
        this.p2_number_labels[tank].setText(number);
      }
    }
    p1_final_score = this.game.get_config('p1_score') + p1_numbers.total_pts;
    p2_final_score = this.game.get_config('p2_score') + p2_numbers.total_pts;
    this.game.set_config('p1_score', p1_final_score);
    this.game.set_config('p2_score', p2_final_score);
    this.p1_score_label.setText(p1_final_score);
    this.p2_score_label.setText(p2_final_score);
    this.game.set_config('hi_score', _.max([p1_final_score, p2_final_score, this.game.get_config('hi_score')]));
    this.stage_label.setText("STAGE " + (this.game.get_config('current_stage')));
    return this.layer.draw();
  };

  ReportScene.prototype.init_scene = function() {
    var image, p1_arrow, p1_number, p1_number_pts, p1_pts, p2_arrow, p2_number, p2_number_pts, p2_pts, tank_sprite;
    this.layer.add(new Kinetic.Text({
      x: 200,
      y: 40,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "HI-SCORE",
      fill: "#DB2B00"
    }));
    this.hi_score_label = new Kinetic.Text({
      x: 328,
      y: 40,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "" + (this.game.get_config('hi_score')),
      fill: "#FF9B3B"
    });
    this.layer.add(this.hi_score_label);
    this.stage_label = new Kinetic.Text({
      x: 250,
      y: 80,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "STAGE " + (this.game.get_config('current_stage')),
      fill: "#fff"
    });
    this.layer.add(this.stage_label);
    image = document.getElementById('tank_sprite');
    tank_sprite = new Kinetic.Sprite({
      x: 300,
      y: 220,
      image: image,
      animation: 'stupid_hp1',
      animations: Animations.movables,
      frameRate: Animations.rate('stupid_hp1'),
      index: 0,
      offset: {
        x: 20,
        y: 20
      },
      rotationDeg: 0
    });
    this.layer.add(tank_sprite);
    this.layer.add(tank_sprite.clone({
      y: 280,
      animation: 'fish_hp1'
    }));
    this.layer.add(tank_sprite.clone({
      y: 340,
      animation: 'fool_hp1'
    }));
    this.layer.add(tank_sprite.clone({
      y: 400,
      animation: 'strong_hp1'
    }));
    this.layer.add(new Kinetic.Rect({
      x: 235,
      y: 423,
      width: 130,
      height: 4,
      fill: "#fff"
    }));
    this.p1_group = new Kinetic.Group();
    this.layer.add(this.p1_group);
    this.p1_score_label = new Kinetic.Text({
      x: 95,
      y: 160,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "0",
      fill: "#FF9B3B",
      align: "right",
      width: 120
    });
    this.p1_group.add(this.p1_score_label);
    this.p1_group.add(this.p1_score_label.clone({
      text: "I-PLAYER",
      fill: "#DB2B00",
      y: 120
    }));
    p1_pts = this.p1_score_label.clone({
      x: 175,
      y: 210,
      text: "PTS",
      width: 40,
      fill: "#fff"
    });
    this.p1_group.add(p1_pts);
    this.p1_group.add(p1_pts.clone({
      y: 270
    }));
    this.p1_group.add(p1_pts.clone({
      y: 330
    }));
    this.p1_group.add(p1_pts.clone({
      y: 390
    }));
    this.p1_group.add(p1_pts.clone({
      x: 145,
      y: 430,
      text: "TOTAL",
      width: 70
    }));
    p1_arrow = new Kinetic.Path({
      x: 260,
      y: 210,
      width: 16,
      height: 20,
      data: 'M8,0 l-8,10 l8,10 l0,-6 l8,0 l0,-8 l-8,0 l0,-6 z',
      fill: '#fff'
    });
    this.p1_group.add(p1_arrow);
    this.p1_group.add(p1_arrow.clone({
      y: 270
    }));
    this.p1_group.add(p1_arrow.clone({
      y: 330
    }));
    this.p1_group.add(p1_arrow.clone({
      y: 390
    }));
    p1_number = this.p1_score_label.clone({
      fill: '#fff',
      x: 226,
      y: 210,
      width: 30,
      text: '75'
    });
    p1_number_pts = p1_number.clone({
      x: 105,
      width: 60,
      text: '3800'
    });
    this.p1_number_labels['stupid'] = p1_number;
    this.p1_number_labels['stupid_pts'] = p1_number_pts;
    this.p1_group.add(this.p1_number_labels['stupid']);
    this.p1_group.add(this.p1_number_labels['stupid_pts']);
    this.p1_number_labels['fish'] = p1_number.clone({
      y: 270
    });
    this.p1_number_labels['fish_pts'] = p1_number_pts.clone({
      y: 270
    });
    this.p1_group.add(this.p1_number_labels['fish']);
    this.p1_group.add(this.p1_number_labels['fish_pts']);
    this.p1_number_labels['fool'] = p1_number.clone({
      y: 330
    });
    this.p1_number_labels['fool_pts'] = p1_number_pts.clone({
      y: 330
    });
    this.p1_group.add(this.p1_number_labels['fool']);
    this.p1_group.add(this.p1_number_labels['fool_pts']);
    this.p1_number_labels['strong'] = p1_number.clone({
      y: 390
    });
    this.p1_number_labels['strong_pts'] = p1_number_pts.clone({
      y: 390
    });
    this.p1_group.add(this.p1_number_labels['strong']);
    this.p1_group.add(this.p1_number_labels['strong_pts']);
    this.p1_number_labels['total'] = p1_number.clone({
      y: 430
    });
    this.p1_group.add(this.p1_number_labels['total']);
    this.p2_group = new Kinetic.Group();
    this.layer.add(this.p2_group);
    this.p2_score_label = new Kinetic.Text({
      x: 385,
      y: 160,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "0",
      fill: "#FF9B3B"
    });
    this.p2_group.add(this.p2_score_label);
    this.p2_group.add(this.p2_score_label.clone({
      text: "II-PLAYER",
      fill: "#DB2B00",
      y: 120
    }));
    p2_pts = this.p2_score_label.clone({
      y: 210,
      text: "PTS",
      width: 40,
      fill: "#fff"
    });
    this.p2_group.add(p2_pts);
    this.p2_group.add(p2_pts.clone({
      y: 270
    }));
    this.p2_group.add(p2_pts.clone({
      y: 330
    }));
    this.p2_group.add(p2_pts.clone({
      y: 390
    }));
    this.p2_group.add(p2_pts.clone({
      y: 430,
      text: "TOTAL",
      width: 70
    }));
    p2_arrow = new Kinetic.Path({
      x: 324,
      y: 210,
      width: 16,
      height: 20,
      data: 'M8,0 l8,10 l-8,10 l0,-6 l-8,0 l0,-8 l8,0 l0,-6 z',
      fill: '#fff'
    });
    this.p2_group.add(p2_arrow);
    this.p2_group.add(p2_arrow.clone({
      y: 270
    }));
    this.p2_group.add(p2_arrow.clone({
      y: 330
    }));
    this.p2_group.add(p2_arrow.clone({
      y: 390
    }));
    p2_number = this.p2_score_label.clone({
      fill: '#fff',
      x: 344,
      y: 210,
      width: 30,
      text: '75'
    });
    p2_number_pts = p2_number.clone({
      x: 435,
      width: 60,
      text: '3800'
    });
    this.p2_number_labels['stupid'] = p2_number;
    this.p2_number_labels['stupid_pts'] = p2_number_pts;
    this.p2_group.add(this.p2_number_labels['stupid']);
    this.p2_group.add(this.p2_number_labels['stupid_pts']);
    this.p2_number_labels['fish'] = p2_number.clone({
      y: 270
    });
    this.p2_number_labels['fish_pts'] = p2_number_pts.clone({
      y: 270
    });
    this.p2_group.add(this.p2_number_labels['fish']);
    this.p2_group.add(this.p2_number_labels['fish_pts']);
    this.p2_number_labels['fool'] = p2_number.clone({
      y: 330
    });
    this.p2_number_labels['fool_pts'] = p2_number_pts.clone({
      y: 330
    });
    this.p2_group.add(this.p2_number_labels['fool']);
    this.p2_group.add(this.p2_number_labels['fool_pts']);
    this.p2_number_labels['strong'] = p2_number.clone({
      y: 390
    });
    this.p2_number_labels['strong_pts'] = p2_number_pts.clone({
      y: 390
    });
    this.p2_group.add(this.p2_number_labels['strong']);
    this.p2_group.add(this.p2_number_labels['strong_pts']);
    this.p2_number_labels['total'] = p2_number.clone({
      y: 430
    });
    this.p2_group.add(this.p2_number_labels['total']);
    return this.p2_group.hide();
  };

  return ReportScene;

})(Scene);

HiScoreScene = (function(_super) {
  __extends(HiScoreScene, _super);

  function HiScoreScene(game) {
    this.game = game;
    HiScoreScene.__super__.constructor.call(this, this.game);
  }

  HiScoreScene.prototype.start = function() {
    return HiScoreScene.__super__.start.call(this);
  };

  return HiScoreScene;

})(Scene);

GameScene = (function(_super) {
  __extends(GameScene, _super);

  function GameScene(game) {
    this.game = game;
    GameScene.__super__.constructor.call(this, this.game);
    this.map = new Map2D(this.layer);
    $.ajax({
      url: "data/terrains.json",
      success: (function(_this) {
        return function(json) {
          return _this.builder = new TiledMapBuilder(_this.map, json);
        };
      })(this),
      dataType: 'json',
      async: false
    });
    this.reset_config_variables();
    this.init_status();
    this.bgms = [
      new Howl({
        urls: ['data/s1.ogg', 'data/s1.mp3'],
        loop: true
      }), new Howl({
        urls: ['data/s2.ogg', 'data/s2.mp3'],
        loop: true
      }), new Howl({
        urls: ['data/s3.ogg', 'data/s3.mp3'],
        loop: true
      }), new Howl({
        urls: ['data/s2.ogg', 'data/s2.mp3'],
        loop: true
      }), new Howl({
        urls: ['data/s5.ogg', 'data/s5.mp3'],
        loop: true
      }), new Howl({
        urls: ['data/s6.ogg', 'data/s6.mp3'],
        loop: true
      }), new Howl({
        urls: ['data/s7.ogg', 'data/s7.mp3'],
        loop: true
      }), new Howl({
        urls: ['data/win.ogg', 'data/win.mp3'],
        loop: true
      })
    ];
    window.gs = this;
  }

  GameScene.prototype.current_bgm = function() {
    return this.bgms[(this.current_stage - 1) % 8];
  };

  GameScene.prototype.reset_config_variables = function() {
    this.fps = 0;
    this.remain_enemy_counts = 0;
    this.remain_user_p1_lives = 0;
    this.remain_user_p2_lives = 0;
    this.current_stage = 0;
    return this.last_enemy_born_area_index = 0;
  };

  GameScene.prototype.load_config_variables = function() {
    this.fps = this.game.get_config('fps');
    this.remain_enemy_counts = this.game.get_config('enemies_per_stage');
    this.remain_user_p1_lives = this.game.get_config('p1_lives');
    if (this.game.get_config('players') === 2) {
      this.remain_user_p2_lives = this.game.get_config('p2_lives');
    } else {
      this.remain_user_p2_lives = 0;
    }
    this.current_stage = this.game.get_config('current_stage');
    this.last_enemy_born_area_index = 0;
    return this.winner = null;
  };

  GameScene.prototype.start = function() {
    GameScene.__super__.start.call(this);
    this.load_config_variables();
    this.start_map();
    this.enable_user_control();
    this.enable_system_control();
    this.start_time_line();
    this.running = true;
    this.p1_user_initialized = false;
    this.p2_user_initialized = false;
    return this.current_bgm().play();
  };

  GameScene.prototype.stop = function() {
    GameScene.__super__.stop.call(this);
    this.update_status();
    this.disable_controls();
    this.stop_time_line();
    if (this.winner === 'user') {
      this.save_user_status();
    }
    this.map.reset();
    return this.current_bgm().stop();
  };

  GameScene.prototype.save_user_status = function() {
    this.game.set_config('p1_lives', this.remain_user_p1_lives + 1);
    this.game.set_config('p2_lives', this.remain_user_p2_lives + 1);
    if (this.map.p1_tank() !== void 0) {
      this.game.set_config('p1_level', this.map.p1_tank().level);
      this.game.set_config('p1_ship', this.map.p1_tank().ship);
    }
    if (this.map.p2_tank() !== void 0) {
      this.game.set_config('p2_level', this.map.p2_tank().level);
      return this.game.set_config('p2_ship', this.map.p2_tank().ship);
    }
  };

  GameScene.prototype.start_map = function() {
    this.map.bind('map_ready', this.born_p1_tank, this);
    this.map.bind('map_ready', this.born_p2_tank, this);
    this.map.bind('map_ready', this.born_enemy_tank, this);
    this.map.bind('map_ready', this.born_enemy_tank, this);
    this.map.bind('map_ready', this.born_enemy_tank, this);
    this.map.bind('tank_destroyed', this.born_tanks, this);
    this.map.bind('tank_destroyed', this.draw_tank_points, this);
    this.map.bind('gift_consumed', this.draw_gift_points, this);
    this.map.bind('home_destroyed', this.check_enemy_win, this);
    this.map.bind('tank_life_up', this.add_extra_life, this);
    this.builder.setup_stage(this.current_stage);
    return this.map.trigger('map_ready');
  };

  GameScene.prototype.enable_user_control = function() {
    $(document).bind("keyup", (function(_this) {
      return function(event) {
        if (_this.map.p1_tank()) {
          _this.map.p1_tank().commander.add_key_event("keyup", event.which);
        }
        if (_this.map.p2_tank()) {
          _this.map.p2_tank().commander.add_key_event("keyup", event.which);
        }
        return false;
      };
    })(this));
    return $(document).bind("keydown", (function(_this) {
      return function(event) {
        if (_this.map.p1_tank()) {
          _this.map.p1_tank().commander.add_key_event("keydown", event.which);
        }
        if (_this.map.p2_tank()) {
          _this.map.p2_tank().commander.add_key_event("keydown", event.which);
        }
        return false;
      };
    })(this));
  };

  GameScene.prototype.enable_system_control = function() {
    return $(document).bind("keydown", (function(_this) {
      return function(event) {
        switch (event.which) {
          case 13:
            if (_this.running) {
              return _this.pause();
            } else {
              return _this.rescue();
            }
            break;
          case 27:
            return _this.game.reset();
        }
      };
    })(this));
  };

  GameScene.prototype.disable_controls = function() {
    if (this.map.p1_tank()) {
      this.map.p1_tank().commander.reset();
    }
    if (this.map.p2_tank()) {
      this.map.p2_tank().commander.reset();
    }
    $(document).unbind("keyup");
    return $(document).unbind("keydown");
  };

  GameScene.prototype.pause = function() {
    this.running = false;
    this.stop_time_line();
    this.disable_user_controls();
    return this.current_bgm().pause();
  };

  GameScene.prototype.disable_user_controls = function() {
    this.disable_controls();
    return this.enable_system_control();
  };

  GameScene.prototype.rescue = function() {
    this.running = true;
    this.start_time_line();
    this.enable_user_control();
    return this.current_bgm().play();
  };

  GameScene.prototype.start_time_line = function() {
    var last_time;
    last_time = new Date();
    this.timeline = setInterval((function(_this) {
      return function() {
        var current_time, delta_time, unit, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
        current_time = new Date();
        delta_time = current_time.getMilliseconds() - last_time.getMilliseconds();
        if (delta_time < 0) {
          delta_time += 1000;
        }
        _ref = _this.map.missiles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          unit = _ref[_i];
          unit.integration(delta_time);
        }
        _ref1 = _this.map.gifts;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          unit = _ref1[_j];
          unit.integration(delta_time);
        }
        _ref2 = _this.map.tanks;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          unit = _ref2[_k];
          unit.integration(delta_time);
        }
        _ref3 = _this.map.missiles;
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          unit = _ref3[_l];
          unit.integration(delta_time);
        }
        last_time = current_time;
        return _this.frame_rate += 1;
      };
    })(this), parseInt(1000 / this.fps));
    return this.frame_timeline = setInterval((function(_this) {
      return function() {
        _this.frame_rate_label.setText(_this.frame_rate + " fps");
        return _this.frame_rate = 0;
      };
    })(this), 1000);
  };

  GameScene.prototype.stop_time_line = function() {
    clearInterval(this.timeline);
    return clearInterval(this.frame_timeline);
  };

  GameScene.prototype.init_status = function() {
    var i, symbol, tx, ty, user_p1_label, user_p1_symbol, user_p2_label, user_p2_symbol, _i, _ref;
    this.status_panel = new Kinetic.Group();
    this.layer.add(this.status_panel);
    this.status_panel.add(new Kinetic.Rect({
      x: 520,
      y: 0,
      fill: "#999",
      width: 80,
      height: 520
    }));
    this.frame_rate = 0;
    this.frame_rate_label = new Kinetic.Text({
      x: 526,
      y: 490,
      fontSize: 20,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "0 fps",
      fill: "#c00"
    });
    this.status_panel.add(this.frame_rate_label);
    this.enemy_symbols = [];
    for (i = _i = 1, _ref = this.remain_enemy_counts; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
      tx = (i % 2 === 1 ? 540 : 560);
      ty = parseInt((i - 1) / 2) * 25 + 20;
      symbol = this.new_symbol(this.status_panel, 'enemy', tx, ty);
      this.enemy_symbols.push(symbol);
    }
    user_p1_label = new Kinetic.Text({
      x: 540,
      y: 300,
      fontSize: 18,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "1P",
      fill: "#000"
    });
    user_p1_symbol = this.new_symbol(this.status_panel, 'user', 540, 320);
    this.user_p1_remain_lives_label = new Kinetic.Text({
      x: 565,
      y: 324,
      fontSize: 16,
      fontFamily: "Courier",
      text: "" + this.remain_user_p1_lives,
      fill: "#000"
    });
    this.status_panel.add(user_p1_label);
    this.status_panel.add(this.user_p1_remain_lives_label);
    user_p2_label = new Kinetic.Text({
      x: 540,
      y: 350,
      fontSize: 18,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "2P",
      fill: "#000"
    });
    user_p2_symbol = this.new_symbol(this.status_panel, 'user', 540, 370);
    this.user_p2_remain_lives_label = new Kinetic.Text({
      x: 565,
      y: 374,
      fontSize: 16,
      fontFamily: "Courier",
      text: "" + this.remain_user_p2_lives,
      fill: "#000"
    });
    this.status_panel.add(user_p2_label);
    this.status_panel.add(this.user_p2_remain_lives_label);
    this.new_symbol(this.status_panel, 'stage', 540, 420);
    this.stage_label = new Kinetic.Text({
      x: 560,
      y: 445,
      fontSize: 16,
      fontFamily: "Courier",
      text: "" + this.current_stage,
      fill: "#000"
    });
    return this.status_panel.add(this.stage_label);
  };

  GameScene.prototype.update_status = function() {
    var i, symbol, tx, ty, _i, _ref;
    _.each(this.enemy_symbols, function(symbol) {
      return symbol.destroy();
    });
    this.enemy_symbols = [];
    if (this.remain_enemy_counts > 0) {
      for (i = _i = 1, _ref = this.remain_enemy_counts; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        tx = (i % 2 === 1 ? 540 : 560);
        ty = parseInt((i - 1) / 2) * 25 + 20;
        symbol = this.new_symbol(this.status_panel, 'enemy', tx, ty);
        this.enemy_symbols.push(symbol);
      }
    }
    this.user_p1_remain_lives_label.setText(this.remain_user_p1_lives);
    this.user_p2_remain_lives_label.setText(this.remain_user_p2_lives);
    return this.stage_label.setText(this.current_stage);
  };

  GameScene.prototype.new_symbol = function(parent, type, tx, ty) {
    var animations, symbol;
    animations = (function() {
      switch (type) {
        case 'enemy':
          return [
            {
              x: 320,
              y: 340,
              width: 20,
              height: 20
            }
          ];
        case 'user':
          return [
            {
              x: 340,
              y: 340,
              width: 20,
              height: 20
            }
          ];
        case 'stage':
          return [
            {
              x: 280,
              y: 340,
              width: 40,
              height: 40
            }
          ];
      }
    })();
    symbol = new Kinetic.Sprite({
      x: tx,
      y: ty,
      image: this.map.image,
      animation: 'static',
      animations: {
        'static': animations
      },
      frameRate: 1,
      index: 0
    });
    parent.add(symbol);
    symbol.start();
    return symbol;
  };

  GameScene.prototype.add_extra_life = function(tank) {
    if (tank instanceof UserP1Tank) {
      this.remain_user_p1_lives += 1;
    } else {
      this.remain_user_p2_lives += 1;
    }
    return this.update_status();
  };

  GameScene.prototype.born_p1_tank = function() {
    var inherited_level;
    if (this.remain_user_p1_lives > 0) {
      this.remain_user_p1_lives -= 1;
      this.map.add_tank(UserP1Tank, new MapArea2D(160, 480, 200, 520));
      if (!this.p1_user_initialized) {
        inherited_level = this.game.get_config('p1_level');
        this.map.p1_tank().level_up(inherited_level - 1);
        this.p1_user_initialized = true;
      }
      return this.update_status();
    } else {
      return this.check_enemy_win();
    }
  };

  GameScene.prototype.born_p2_tank = function() {
    var inherited_level;
    if (this.remain_user_p2_lives > 0) {
      this.remain_user_p2_lives -= 1;
      this.map.add_tank(UserP2Tank, new MapArea2D(320, 480, 360, 520));
      if (!this.p2_user_initialized) {
        inherited_level = this.game.get_config('p2_level');
        this.map.p2_tank().level_up(inherited_level - 1);
        this.p2_user_initialized = true;
      }
      return this.update_status();
    } else {
      return this.check_enemy_win();
    }
  };

  GameScene.prototype.born_enemy_tank = function() {
    var enemy_born_areas, enemy_tank_types, randomed;
    if (this.remain_enemy_counts > 0) {
      this.remain_enemy_counts -= 1;
      enemy_born_areas = [new MapArea2D(0, 0, 40, 40), new MapArea2D(240, 0, 280, 40), new MapArea2D(480, 0, 520, 40)];
      enemy_tank_types = [StupidTank, FishTank, FoolTank, StrongTank];
      randomed = parseInt(Math.random() * 1000) % _.size(enemy_tank_types);
      this.map.add_tank(enemy_tank_types[randomed], enemy_born_areas[this.last_enemy_born_area_index]);
      this.last_enemy_born_area_index = (this.last_enemy_born_area_index + 1) % 3;
      return this.update_status();
    } else {
      return this.check_user_win();
    }
  };

  GameScene.prototype.check_user_win = function() {
    if (this.remain_enemy_counts === 0 && _.size(this.map.enemy_tanks()) === 0) {
      return this.user_win();
    }
  };

  GameScene.prototype.check_enemy_win = function() {
    if (this.map.home().destroyed) {
      this.enemy_win();
    }
    if (this.remain_user_p1_lives === 0 && this.remain_user_p2_lives === 0) {
      return this.enemy_win();
    }
  };

  GameScene.prototype.user_win = function() {
    if (!_.isNull(this.winner)) {
      return;
    }
    this.winner = 'user';
    return setTimeout(((function(_this) {
      return function() {
        _this.game.next_stage();
        return _this.game.switch_scene('report');
      };
    })(this)), 5000);
  };

  GameScene.prototype.enemy_win = function() {
    if (!_.isNull(this.winner)) {
      return;
    }
    this.winner = 'enemy';
    this.disable_user_controls();
    return setTimeout((function(_this) {
      return function() {
        _this.game.set_config('game_over', true);
        return _this.game.switch_scene('report');
      };
    })(this), 5000);
  };

  GameScene.prototype.born_tanks = function(tank, killed_by_tank) {
    var p1_kills, p2_kills;
    if (tank instanceof UserP1Tank) {
      return this.born_p1_tank();
    } else if (tank instanceof UserP2Tank) {
      return this.born_p2_tank();
    } else {
      if (killed_by_tank instanceof UserP1Tank) {
        p1_kills = this.game.get_config('p1_killed_enemies');
        p1_kills.push(tank.type());
      } else if (killed_by_tank instanceof UserP2Tank) {
        p2_kills = this.game.get_config('p2_killed_enemies');
        p2_kills.push(tank.type());
      }
      return this.born_enemy_tank();
    }
  };

  GameScene.prototype.draw_tank_points = function(tank, killed_by_tank) {
    var point_label;
    if (tank instanceof EnemyTank) {
      point_label = new Kinetic.Text({
        x: (tank.area.x1 + tank.area.x2) / 2 - 10,
        y: (tank.area.y1 + tank.area.y2) / 2 - 5,
        fontSize: 16,
        fontStyle: "bold",
        fontFamily: "Courier",
        text: this.game.get_config("score_for_" + (tank.type())),
        fill: "#fff"
      });
      this.status_panel.add(point_label);
      return setTimeout(function() {
        return point_label.destroy();
      }, 2000);
    }
  };

  GameScene.prototype.draw_gift_points = function(gift, tanks) {
    return _.detect(tanks, (function(_this) {
      return function(tank) {
        var point_label;
        if (tank instanceof UserTank) {
          point_label = new Kinetic.Text({
            x: (gift.area.x1 + gift.area.x2) / 2 - 10,
            y: (gift.area.y1 + gift.area.y2) / 2 - 5,
            fontSize: 16,
            fontStyle: "bold",
            fontFamily: "Courier",
            text: _this.game.get_config("score_for_gift"),
            fill: "#fff"
          });
          _this.status_panel.add(point_label);
          setTimeout(function() {
            return point_label.destroy();
          }, 2000);
          return true;
        } else {
          return false;
        }
      };
    })(this));
  };

  return GameScene;

})(Scene);

TiledMapBuilder = (function() {
  function TiledMapBuilder(map, json) {
    this.map = map;
    this.json = json;
    this.tile_width = parseInt(this.json.tilewidth);
    this.tile_height = parseInt(this.json.tileheight);
    this.map_width = parseInt(this.json.width);
    this.map_height = parseInt(this.json.height);
    this.tile_properties = {};
    _.each(this.json.tilesets, (function(_this) {
      return function(tileset) {
        var gid, props, _ref, _results;
        _ref = tileset.tileproperties;
        _results = [];
        for (gid in _ref) {
          props = _ref[gid];
          _results.push(_this.tile_properties[tileset.firstgid + parseInt(gid)] = props);
        }
        return _results;
      };
    })(this));
  }

  TiledMapBuilder.prototype.setup_stage = function(stage) {
    var home_layer, stage_layer;
    home_layer = _.detect(this.json.layers, function(layer) {
      return layer.name === "Home";
    });
    stage_layer = _.detect(this.json.layers, function(layer) {
      return layer.name === ("Stage " + stage);
    });
    return _.each([home_layer, stage_layer], (function(_this) {
      return function(layer) {
        var area, h, properties, tile_id, w, x1, y1, _ref, _results;
        h = 0;
        _results = [];
        while (h < _this.map_height) {
          w = 0;
          while (w < _this.map_width) {
            tile_id = layer.data[h * _this.map_width + w];
            if (tile_id !== 0) {
              properties = _this.tile_properties[tile_id];
              _ref = [w * _this.tile_width + parseInt(properties.x_offset), h * _this.tile_height + parseInt(properties.y_offset)], x1 = _ref[0], y1 = _ref[1];
              area = new MapArea2D(x1, y1, x1 + parseInt(properties.width), y1 + parseInt(properties.height));
              _this.map.add_terrain(eval(properties.type), area);
            }
            w += 1;
          }
          _results.push(h += 1);
        }
        return _results;
      };
    })(this));
  };

  return TiledMapBuilder;

})();

OnlineGamesScene = (function(_super) {
  __extends(OnlineGamesScene, _super);

  function OnlineGamesScene(game) {
    this.game = game;
    OnlineGamesScene.__super__.constructor.call(this, this.game);
    this.static_group = new Kinetic.Group();
    this.layer.add(this.static_group);
    this.init_statics();
  }

  OnlineGamesScene.prototype.start = function() {
    OnlineGamesScene.__super__.start.call(this);
    this.enable_selection_control();
    return this.update_game_list();
  };

  OnlineGamesScene.prototype.stop = function() {
    OnlineGamesScene.__super__.stop.call(this);
    this.disable_selection_control();
    return this.prepare_for_game_scene();
  };

  OnlineGamesScene.prototype.prepare_for_game_scene = function() {
    this.game.set_config('game_over', false);
    this.game.set_config('stage_autostart', false);
    this.game.set_config('current_stage', 1);
    this.game.set_config('p1_score', 0);
    this.game.set_config('p2_score', 0);
    this.game.set_config('p1_lives', 2);
    this.game.set_config('p2_lives', 2);
    this.game.set_config('p1_level', 1);
    return this.game.set_config('p2_level', 1);
  };

  OnlineGamesScene.prototype.enable_selection_control = function() {
    return $(document).bind("keydown", (function(_this) {
      return function(event) {
        switch (event.which) {
          case 13:
            return _this.game.switch_scene('stage');
          case 32:
            return _this.toggle_game();
        }
      };
    })(this));
  };

  OnlineGamesScene.prototype.disable_selection_control = function() {
    return $(document).unbind("keydown");
  };

  OnlineGamesScene.prototype.toggle_game = function() {
    var curr_position;
    curr_position = (this.game.get_config('curr_menu_game') + 1) % this.game.get_config('online_games').length;
    this.game.set_config('curr_menu_game', curr_position);
    return this.update_game_list();
  };

  OnlineGamesScene.prototype.update_game_list = function() {
    var gm, i, _i, _len, _ref;
    console.log(this.game.get_config('curr_menu_game'));
    _ref = this.game_labels;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      gm = _ref[i];
      if (this.game.get_config('curr_menu_game') === i) {
        gm.setFontStyle('bold');
      } else {
        gm.setFontStyle('normal');
      }
    }
    return this.layer.draw();
  };

  OnlineGamesScene.prototype.init_statics = function() {
    var game, i, online_game, _i, _len, _ref, _results;
    this.game_labels = [];
    _ref = this.game.get_config('online_games');
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      game = _ref[i];
      online_game = new Kinetic.Text({
        x: 40,
        y: 40 + 20 * i,
        fontSize: 22,
        fontStyle: "normal",
        fontFamily: "Courier",
        text: game,
        fill: "#fff"
      });
      this.game_labels.push(online_game);
      _results.push(this.static_group.add(online_game));
    }
    return _results;
  };

  return OnlineGamesScene;

})(Scene);

Point = (function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  return Point;

})();

MapArea2D = (function() {
  function MapArea2D(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  MapArea2D.prototype.intersect = function(area) {
    return new MapArea2D(_.max([area.x1, this.x1]), _.max([area.y1, this.y1]), _.min([area.x2, this.x2]), _.min([area.y2, this.y2]));
  };

  MapArea2D.prototype.sub = function(area) {
    var intersection;
    intersection = this.intersect(area);
    return _.select([new MapArea2D(this.x1, this.y1, this.x2, intersection.y1), new MapArea2D(this.x1, intersection.y2, this.x2, this.y2), new MapArea2D(this.x1, intersection.y1, intersection.x1, intersection.y2), new MapArea2D(intersection.x2, intersection.y1, this.x2, intersection.y2)], function(candidate_area) {
      return candidate_area.valid();
    });
  };

  MapArea2D.prototype.collide = function(area) {
    return !(this.x2 <= area.x1 || this.y2 <= area.y1 || this.x1 >= area.x2 || this.y1 >= area.y2);
  };

  MapArea2D.prototype.extend = function(direction, ratio) {
    switch (direction) {
      case Direction.UP:
        return new MapArea2D(this.x1, this.y1 - ratio * this.height(), this.x2, this.y2);
      case Direction.RIGHT:
        return new MapArea2D(this.x1, this.y1, this.x2 + ratio * this.width(), this.y2);
      case Direction.DOWN:
        return new MapArea2D(this.x1, this.y1, this.x2, this.y2 + ratio * this.height());
      case Direction.LEFT:
        return new MapArea2D(this.x1 - ratio * this.width(), this.y1, this.x2, this.y2);
    }
  };

  MapArea2D.prototype.equals = function(area) {
    if (!(area instanceof MapArea2D)) {
      return false;
    }
    return area.x1 === this.x1 && area.x2 === this.x2 && area.y1 === this.y1 && area.y2 === this.y2;
  };

  MapArea2D.prototype.valid = function() {
    return this.x2 > this.x1 && this.y2 > this.y1;
  };

  MapArea2D.prototype.center = function() {
    return new Point((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
  };

  MapArea2D.prototype.clone = function() {
    return new MapArea2D(this.x1, this.y1, this.x2, this.y2);
  };

  MapArea2D.prototype.width = function() {
    return this.x2 - this.x1;
  };

  MapArea2D.prototype.height = function() {
    return this.y2 - this.y1;
  };

  MapArea2D.prototype.to_s = function() {
    return "[" + this.x1 + ", " + this.y1 + ", " + this.x2 + ", " + this.y2 + "]";
  };

  return MapArea2D;

})();

MapArea2DVertex = (function(_super) {
  __extends(MapArea2DVertex, _super);

  function MapArea2DVertex(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.siblings = [];
  }

  MapArea2DVertex.prototype.init_vxy = function(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  };

  MapArea2DVertex.prototype.add_sibling = function(sibling) {
    return this.siblings.push(sibling);
  };

  MapArea2DVertex.prototype.a_star_weight = function(target_vertex) {
    return (Math.pow(this.vx - target_vertex.vx, 2) + Math.pow(this.vy - target_vertex.vy, 2)) / 2;
  };

  return MapArea2DVertex;

})(MapArea2D);

Map2D = (function() {
  Map2D.prototype.max_x = 520;

  Map2D.prototype.max_y = 520;

  Map2D.prototype.default_width = 40;

  Map2D.prototype.default_height = 40;

  Map2D.prototype.infinity = 65535;

  Map2D.prototype.map_units = [];

  Map2D.prototype.terrains = [];

  Map2D.prototype.tanks = [];

  Map2D.prototype.missiles = [];

  Map2D.prototype.gifts = [];

  function Map2D(canvas) {
    this.canvas = canvas;
    this.groups = {
      gift: new Kinetic.Group(),
      front: new Kinetic.Group(),
      middle: new Kinetic.Group(),
      back: new Kinetic.Group()
    };
    this.canvas.add(this.groups['back']);
    this.canvas.add(this.groups['middle']);
    this.canvas.add(this.groups['front']);
    this.canvas.add(this.groups['gift']);
    this.image = document.getElementById("tank_sprite");
    this.vertexes_columns = 4 * this.max_x / this.default_width - 3;
    this.vertexes_rows = 4 * this.max_y / this.default_height - 3;
    this.vertexes = this.init_vertexes();
    this.home_vertex = this.vertexes[24][48];
    this.bindings = {};
  }

  Map2D.prototype.reset = function() {
    this.bindings = {};
    return _.each(this.map_units, function(unit) {
      return unit.destroy();
    });
  };

  Map2D.prototype.add_terrain = function(terrain_cls, area) {
    var terrain;
    terrain = new terrain_cls(this, area);
    this.terrains.push(terrain);
    this.map_units.push(terrain);
    return terrain;
  };

  Map2D.prototype.add_tank = function(tank_cls, area) {
    var tank;
    tank = new tank_cls(this, area);
    this.tanks.push(tank);
    this.map_units.push(tank);
    return tank;
  };

  Map2D.prototype.add_missile = function(parent) {
    var missile;
    missile = new Missile(this, parent);
    this.missiles.push(missile);
    this.map_units.push(missile);
    return missile;
  };

  Map2D.prototype.random_gift = function() {
    var gift, gift_choice, gift_classes, vx, vy;
    _.each(this.gifts, function(gift) {
      return gift.destroy();
    });
    gift_classes = [GunGift, HatGift, ShipGift, StarGift, LifeGift, ClockGift, ShovelGift, LandMineGift];
    vx = parseInt(Math.random() * this.vertexes_rows);
    vy = parseInt(Math.random() * this.vertexes_columns);
    gift_choice = parseInt(Math.random() * 1000) % _.size(gift_classes);
    gift = new gift_classes[gift_choice](this, this.vertexes[vx][vy].clone());
    this.gifts.push(gift);
    this.map_units.push(gift);
    return gift;
  };

  Map2D.prototype.delete_map_unit = function(map_unit) {
    if (map_unit instanceof Terrain) {
      this.terrains = _.without(this.terrains, map_unit);
    } else if (map_unit instanceof Missile) {
      this.missiles = _.without(this.missiles, map_unit);
    } else if (map_unit instanceof Tank) {
      this.tanks = _.without(this.tanks, map_unit);
    } else if (map_unit instanceof Gift) {
      this.gifts = _.without(this.gifts, map_unit);
    }
    return this.map_units = _.without(this.map_units, map_unit);
  };

  Map2D.prototype.p1_tank = function() {
    return _.first(_.select(this.tanks, function(tank) {
      return tank.type() === "user_p1";
    }));
  };

  Map2D.prototype.p2_tank = function() {
    return _.first(_.select(this.tanks, function(tank) {
      return tank.type() === "user_p2";
    }));
  };

  Map2D.prototype.home = function() {
    return _.first(_.select(this.terrains, function(terrain) {
      return terrain.type() === "home";
    }));
  };

  Map2D.prototype.user_tanks = function() {
    return _.select(this.tanks, function(tank) {
      return tank instanceof UserTank;
    });
  };

  Map2D.prototype.enemy_tanks = function() {
    return _.select(this.tanks, function(tank) {
      return tank instanceof EnemyTank;
    });
  };

  Map2D.prototype.units_at = function(area) {
    return _.select(this.map_units, function(map_unit) {
      return map_unit.area.collide(area);
    });
  };

  Map2D.prototype.out_of_bound = function(area) {
    return area.x1 < 0 || area.x2 > this.max_x || area.y1 < 0 || area.y2 > this.max_y;
  };

  Map2D.prototype.area_available = function(unit, area) {
    return _.all(this.map_units, function(map_unit) {
      return (map_unit === unit) || map_unit.accept(unit) || !map_unit.area.collide(area);
    });
  };

  Map2D.prototype.init_vertexes = function() {
    var column_vertexes, sib, vertexes, x, x1, x2, y, y1, y2, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    vertexes = [];
    _ref = [0, this.default_width], x1 = _ref[0], x2 = _ref[1];
    while (x2 <= this.max_x) {
      column_vertexes = [];
      _ref1 = [0, this.default_height], y1 = _ref1[0], y2 = _ref1[1];
      while (y2 <= this.max_y) {
        column_vertexes.push(new MapArea2DVertex(x1, y1, x2, y2));
        _ref2 = [y1 + this.default_height / 4, y2 + this.default_height / 4], y1 = _ref2[0], y2 = _ref2[1];
      }
      vertexes.push(column_vertexes);
      _ref3 = [x1 + this.default_width / 4, x2 + this.default_width / 4], x1 = _ref3[0], x2 = _ref3[1];
    }
    _ref4 = _.range(0, this.vertexes_columns);
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      x = _ref4[_i];
      _ref5 = _.range(0, this.vertexes_rows);
      for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
        y = _ref5[_j];
        _ref6 = [
          {
            x: x,
            y: y - 1
          }, {
            x: x + 1,
            y: y
          }, {
            x: x,
            y: y + 1
          }, {
            x: x - 1,
            y: y
          }
        ];
        for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
          sib = _ref6[_k];
          vertexes[x][y].init_vxy(x, y);
          if ((0 <= (_ref7 = sib.x) && _ref7 < this.vertexes_columns) && (0 <= (_ref8 = sib.y) && _ref8 < this.vertexes_rows)) {
            vertexes[x][y].add_sibling(vertexes[sib.x][sib.y]);
          }
        }
      }
    }
    return vertexes;
  };

  Map2D.prototype.vertexes_at = function(area) {
    var vx, vy;
    vx = parseInt(area.x1 * 4 / this.default_width);
    vy = parseInt(area.y1 * 4 / this.default_height);
    return this.vertexes[vx][vy];
  };

  Map2D.prototype.random_vertex = function() {
    var vx, vy;
    vx = parseInt(Math.random() * this.vertexes_rows);
    if (vx % 2 === 1) {
      vx = vx - 1;
    }
    vy = parseInt(Math.random() * this.vertexes_columns);
    if (vy % 2 === 1) {
      vy = vy - 1;
    }
    return this.vertexes[vx][vy];
  };

  Map2D.prototype.weight = function(tank, from, to) {
    var max_weight, sub_area, terrain_units;
    sub_area = _.first(to.sub(from));
    terrain_units = _.select(this.units_at(sub_area), function(unit) {
      return unit instanceof Terrain;
    });
    if (_.isEmpty(terrain_units)) {
      return 1;
    }
    max_weight = _.max(_.map(terrain_units, function(terrain_unit) {
      return terrain_unit.weight(tank);
    }));
    return max_weight / (this.default_width * this.default_height) * sub_area.width() * sub_area.height();
  };

  Map2D.prototype.shortest_path = function(tank, start_vertex, end_vertex) {
    var d, heap, pi, u, v, x, y, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
    _ref = this.intialize_single_source(end_vertex), d = _ref[0], pi = _ref[1];
    d[start_vertex.vx][start_vertex.vy].key = 0;
    heap = new BinomialHeap();
    _ref1 = _.range(0, this.vertexes_columns);
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      x = _ref1[_i];
      _ref2 = _.range(0, this.vertexes_rows);
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        y = _ref2[_j];
        heap.insert(d[x][y]);
      }
    }
    while (!heap.is_empty()) {
      u = heap.extract_min().satellite;
      _ref3 = u.siblings;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        this.relax(heap, d, pi, u, v, this.weight(tank, u, v), end_vertex);
      }
      if (u === end_vertex) {
        break;
      }
    }
    return this.calculate_shortest_path_from_pi(pi, start_vertex, end_vertex);
  };

  Map2D.prototype.intialize_single_source = function(target_vertex) {
    var column_ds, column_pi, d, node, pi, x, y, _i, _j, _len, _len1, _ref, _ref1;
    d = [];
    pi = [];
    _ref = _.range(0, this.vertexes_columns);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      column_ds = [];
      column_pi = [];
      _ref1 = _.range(0, this.vertexes_rows);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        y = _ref1[_j];
        node = new BinomialHeapNode(this.vertexes[x][y], this.infinity - this.vertexes[x][y].a_star_weight(target_vertex));
        column_ds.push(node);
        column_pi.push(null);
      }
      d.push(column_ds);
      pi.push(column_pi);
    }
    return [d, pi];
  };

  Map2D.prototype.relax = function(heap, d, pi, u, v, w, target_vertex) {
    var aw;
    if (v.vx % 2 === 1 && u.vx % 2 === 1) {
      return;
    }
    if (v.vy % 2 === 1 && u.vy % 2 === 1) {
      return;
    }
    aw = v.a_star_weight(target_vertex) - u.a_star_weight(target_vertex);
    if (d[v.vx][v.vy].key > d[u.vx][u.vy].key + w + aw) {
      heap.decrease_key(d[v.vx][v.vy], d[u.vx][u.vy].key + w + aw);
      return pi[v.vx][v.vy] = u;
    }
  };

  Map2D.prototype.calculate_shortest_path_from_pi = function(pi, start_vertex, end_vertex) {
    var reverse_paths, v;
    reverse_paths = [];
    v = end_vertex;
    while (pi[v.vx][v.vy] !== null) {
      reverse_paths.push(v);
      v = pi[v.vx][v.vy];
    }
    reverse_paths.push(start_vertex);
    return reverse_paths.reverse();
  };

  Map2D.prototype.bind = function(event, callback, scope) {
    if (scope == null) {
      scope = this;
    }
    if (_.isEmpty(this.bindings[event])) {
      this.bindings[event] = [];
    }
    return this.bindings[event].push({
      'scope': scope,
      'callback': callback
    });
  };

  Map2D.prototype.trigger = function() {
    var event, handler, params, _i, _len, _ref, _results;
    event = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (_.isEmpty(this.bindings[event])) {
      return;
    }
    _ref = this.bindings[event];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      handler = _ref[_i];
      _results.push(handler.callback.apply(handler.scope, params));
    }
    return _results;
  };

  return Map2D;

})();

MapUnit2D = (function() {
  MapUnit2D.prototype.group = 'middle';

  MapUnit2D.prototype.max_defend_point = 9;

  function MapUnit2D(map, area) {
    this.map = map;
    this.area = area;
    this.default_width = this.map.default_width;
    this.default_height = this.map.default_height;
    this.bom_on_destroy = false;
    this.destroyed = false;
    this.new_display();
    this.after_new_display();
    this.attached_timeout_handlers = [];
  }

  MapUnit2D.prototype.after_new_display = function() {
    this.map.groups[this.group].add(this.display_object);
    return this.display_object.start();
  };

  MapUnit2D.prototype.destroy_display = function() {
    if (this.bom_on_destroy) {
      this.display_object.setOffset(20, 20);
      this.display_object.setAnimations(Animations.movables);
      this.display_object.setAnimation('bom');
      this.display_object.setFrameRate(Animations.rate('bom'));
      this.display_object.start();
      return this.display_object.afterFrame(3, (function(_this) {
        return function() {
          _this.display_object.stop();
          return _this.display_object.destroy();
        };
      })(this));
    } else {
      this.display_object.stop();
      return this.display_object.destroy();
    }
  };

  MapUnit2D.prototype.width = function() {
    return this.area.x2 - this.area.x1;
  };

  MapUnit2D.prototype.height = function() {
    return this.area.y2 - this.area.y1;
  };

  MapUnit2D.prototype.destroy = function() {
    if (!this.destroyed) {
      this.destroyed = true;
    }
    this.destroy_display();
    this.detach_timeout_events();
    return this.map.delete_map_unit(this);
  };

  MapUnit2D.prototype.defend = function(missile, destroy_area) {
    return 0;
  };

  MapUnit2D.prototype.accept = function(map_unit) {
    return true;
  };

  MapUnit2D.prototype.attach_timeout_event = function(func, delay) {
    var handle;
    handle = setTimeout(func, delay);
    return this.attached_timeout_handlers.push(handle);
  };

  MapUnit2D.prototype.detach_timeout_events = function() {
    return _.each(this.attached_timeout_handlers, function(handle) {
      return clearTimeout(handle);
    });
  };

  return MapUnit2D;

})();

MovableMapUnit2D = (function(_super) {
  __extends(MovableMapUnit2D, _super);

  MovableMapUnit2D.prototype.speed = 0.08;

  function MovableMapUnit2D(map, area) {
    this.map = map;
    this.area = area;
    this.delayed_commands = [];
    this.moving = false;
    this.direction = 0;
    this.commander = new Commander(this);
    MovableMapUnit2D.__super__.constructor.call(this, this.map, this.area);
  }

  MovableMapUnit2D.prototype.new_display = function() {
    var center;
    center = this.area.center();
    return this.display_object = new Kinetic.Sprite({
      x: center.x,
      y: center.y,
      image: this.map.image,
      animation: this.animation_state(),
      animations: Animations.movables,
      frameRate: Animations.rate(this.animation_state()),
      index: 0,
      offset: {
        x: this.area.width() / 2,
        y: this.area.height() / 2
      },
      rotationDeg: this.direction,
      map_unit: this
    });
  };

  MovableMapUnit2D.prototype.update_display = function() {
    var center;
    if (this.destroyed) {
      return;
    }
    this.display_object.setAnimation(this.animation_state());
    this.display_object.setFrameRate(Animations.rate(this.animation_state()));
    this.display_object.setRotationDeg(this.direction);
    center = this.area.center();
    return this.display_object.setAbsolutePosition(center.x, center.y);
  };

  MovableMapUnit2D.prototype.queued_delayed_commands = function() {
    var commands, _ref;
    _ref = [this.delayed_commands, []], commands = _ref[0], this.delayed_commands = _ref[1];
    return commands;
  };

  MovableMapUnit2D.prototype.add_delayed_command = function(command) {
    return this.delayed_commands.push(command);
  };

  MovableMapUnit2D.prototype.integration = function(delta_time) {
    var cmd, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (this.destroyed) {
      return;
    }
    this.commands = _.union(this.commander.next_commands(), this.queued_delayed_commands());
    _ref = this.commands;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cmd = _ref[_i];
      this.handle_turn(cmd);
    }
    _ref1 = this.commands;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      cmd = _ref1[_j];
      _results.push(this.handle_move(cmd, delta_time));
    }
    return _results;
  };

  MovableMapUnit2D.prototype.handle_turn = function(command) {
    switch (command.type) {
      case "direction":
        return this.turn(command.params.direction);
    }
  };

  MovableMapUnit2D.prototype.handle_move = function(command, delta_time) {
    var intent_offset, max_offset, real_offset;
    switch (command.type) {
      case "start_move":
        this.moving = true;
        max_offset = parseInt(this.speed * delta_time);
        intent_offset = command.params.offset;
        if (intent_offset === null) {
          return this.move(max_offset);
        } else if (intent_offset > 0) {
          real_offset = _.min([intent_offset, max_offset]);
          if (this.move(real_offset)) {
            command.params.offset -= real_offset;
            if (command.params.offset > 0) {
              return this.add_delayed_command(command);
            }
          } else {
            return this.add_delayed_command(command);
          }
        }
        break;
      case "stop_move":
        return this.moving = false;
    }
  };

  MovableMapUnit2D.prototype.turn = function(direction) {
    if (_.contains([Direction.UP, Direction.DOWN], direction)) {
      if (this._adjust_x()) {
        this.direction = direction;
      }
    } else {
      if (this._adjust_y()) {
        this.direction = direction;
      }
    }
    return this.update_display();
  };

  MovableMapUnit2D.prototype._try_adjust = function(area) {
    if (this.map.area_available(this, area)) {
      this.area = area;
      return true;
    } else {
      return false;
    }
  };

  MovableMapUnit2D.prototype._adjust_x = function() {
    var offset;
    offset = (this.default_height / 4) - (this.area.x1 + this.default_height / 4) % (this.default_height / 2);
    return this._try_adjust(new MapArea2D(this.area.x1 + offset, this.area.y1, this.area.x2 + offset, this.area.y2));
  };

  MovableMapUnit2D.prototype._adjust_y = function() {
    var offset;
    offset = (this.default_width / 4) - (this.area.y1 + this.default_width / 4) % (this.default_width / 2);
    return this._try_adjust(new MapArea2D(this.area.x1, this.area.y1 + offset, this.area.x2, this.area.y2 + offset));
  };

  MovableMapUnit2D.prototype.move = function(offset) {
    return _.detect(_.range(1, offset + 1).reverse(), (function(_this) {
      return function(os) {
        return _this._try_move(os);
      };
    })(this));
  };

  MovableMapUnit2D.prototype._try_move = function(offset) {
    var offset_x, offset_y, target_area, target_x, target_y, _ref;
    _ref = this._offset_by_direction(offset), offset_x = _ref[0], offset_y = _ref[1];
    if (offset_x === 0 && offset_y === 0) {
      return false;
    }
    target_x = this.area.x1 + offset_x;
    target_y = this.area.y1 + offset_y;
    target_area = new MapArea2D(target_x, target_y, target_x + this.width(), target_y + this.height());
    if (this.map.area_available(this, target_area)) {
      this.area = target_area;
      this.update_display();
      return true;
    } else {
      return false;
    }
  };

  MovableMapUnit2D.prototype._offset_by_direction = function(offset) {
    offset = parseInt(offset);
    switch (this.direction) {
      case Direction.UP:
        return [0, -_.min([offset, this.area.y1])];
      case Direction.RIGHT:
        return [_.min([offset, this.map.max_x - this.area.x2]), 0];
      case Direction.DOWN:
        return [0, _.min([offset, this.map.max_y - this.area.y2])];
      case Direction.LEFT:
        return [-_.min([offset, this.area.x1]), 0];
    }
  };

  return MovableMapUnit2D;

})(MapUnit2D);

Terrain = (function(_super) {
  __extends(Terrain, _super);

  function Terrain() {
    return Terrain.__super__.constructor.apply(this, arguments);
  }

  Terrain.prototype.accept = function(map_unit) {
    return false;
  };

  Terrain.prototype.new_display = function() {
    var animation, animations, _i, _len;
    animations = _.cloneDeep(Animations.terrain(this.type()));
    for (_i = 0, _len = animations.length; _i < _len; _i++) {
      animation = animations[_i];
      animation.x += this.area.x1 % 40;
      animation.y += this.area.y1 % 40;
      animation.width = this.area.width();
      animation.height = this.area.height();
    }
    return this.display_object = new Kinetic.Sprite({
      x: this.area.x1,
      y: this.area.y1,
      image: this.map.image,
      index: 0,
      animation: 'static',
      animations: {
        "static": animations
      },
      map_unit: this
    });
  };

  return Terrain;

})(MapUnit2D);

BrickTerrain = (function(_super) {
  __extends(BrickTerrain, _super);

  function BrickTerrain() {
    return BrickTerrain.__super__.constructor.apply(this, arguments);
  }

  BrickTerrain.prototype.type = function() {
    return "brick";
  };

  BrickTerrain.prototype.weight = function(tank) {
    return 40 / tank.power;
  };

  BrickTerrain.prototype.defend = function(missile, destroy_area) {
    var pieces;
    pieces = this.area.sub(destroy_area);
    _.each(pieces, (function(_this) {
      return function(piece) {
        return _this.map.add_terrain(BrickTerrain, piece);
      };
    })(this));
    this.destroy();
    return 1;
  };

  return BrickTerrain;

})(Terrain);

IronTerrain = (function(_super) {
  __extends(IronTerrain, _super);

  function IronTerrain() {
    return IronTerrain.__super__.constructor.apply(this, arguments);
  }

  IronTerrain.prototype.type = function() {
    return "iron";
  };

  IronTerrain.prototype.weight = function(tank) {
    switch (tank.power) {
      case 1:
        return this.map.infinity;
      case 2:
        return 20;
    }
  };

  IronTerrain.prototype.defend = function(missile, destroy_area) {
    var double_destroy_area, pieces;
    if (missile.power < 2) {
      return this.max_defend_point;
    }
    double_destroy_area = destroy_area.extend(missile.direction, 1);
    pieces = this.area.sub(double_destroy_area);
    _.each(pieces, (function(_this) {
      return function(piece) {
        return _this.map.add_terrain(IronTerrain, piece);
      };
    })(this));
    this.destroy();
    return 2;
  };

  return IronTerrain;

})(Terrain);

WaterTerrain = (function(_super) {
  __extends(WaterTerrain, _super);

  function WaterTerrain() {
    return WaterTerrain.__super__.constructor.apply(this, arguments);
  }

  WaterTerrain.prototype.accept = function(map_unit) {
    if (map_unit instanceof Tank) {
      return map_unit.ship;
    } else {
      return map_unit instanceof Missile;
    }
  };

  WaterTerrain.prototype.type = function() {
    return "water";
  };

  WaterTerrain.prototype.group = "back";

  WaterTerrain.prototype.weight = function(tank) {
    switch (tank.ship) {
      case true:
        return 4;
      case false:
        return this.map.infinity;
    }
  };

  return WaterTerrain;

})(Terrain);

IceTerrain = (function(_super) {
  __extends(IceTerrain, _super);

  function IceTerrain() {
    return IceTerrain.__super__.constructor.apply(this, arguments);
  }

  IceTerrain.prototype.accept = function(map_unit) {
    return true;
  };

  IceTerrain.prototype.type = function() {
    return "ice";
  };

  IceTerrain.prototype.group = "back";

  IceTerrain.prototype.weight = function(tank) {
    return 4;
  };

  return IceTerrain;

})(Terrain);

GrassTerrain = (function(_super) {
  __extends(GrassTerrain, _super);

  function GrassTerrain() {
    return GrassTerrain.__super__.constructor.apply(this, arguments);
  }

  GrassTerrain.prototype.accept = function(map_unit) {
    return true;
  };

  GrassTerrain.prototype.type = function() {
    return "grass";
  };

  GrassTerrain.prototype.group = "front";

  GrassTerrain.prototype.weight = function(tank) {
    return 4;
  };

  return GrassTerrain;

})(Terrain);

HomeTerrain = (function(_super) {
  __extends(HomeTerrain, _super);

  function HomeTerrain(map, area) {
    this.map = map;
    this.area = area;
    HomeTerrain.__super__.constructor.call(this, this.map, this.area);
  }

  HomeTerrain.prototype.type = function() {
    return "home";
  };

  HomeTerrain.prototype.accept = function(map_unit) {
    if (this.destroyed && map_unit instanceof Missile) {
      return true;
    }
    return false;
  };

  HomeTerrain.prototype.weight = function(tank) {
    return 0;
  };

  HomeTerrain.prototype.new_display = function() {
    return this.display_object = new Kinetic.Sprite({
      x: this.area.x1,
      y: this.area.y1,
      image: this.map.image,
      index: 0,
      animations: {
        origin: Animations.terrain('home_origin'),
        destroyed: Animations.terrain('home_destroyed')
      },
      animation: 'origin',
      map_unit: this
    });
  };

  HomeTerrain.prototype.defend = function(missile, destroy_area) {
    if (this.destroyed) {
      return this.max_defend_point;
    }
    this.destroyed = true;
    this.display_object.setAnimation('destroyed');
    this.map.trigger('home_destroyed');
    return this.max_defend_point;
  };

  HomeTerrain.prototype.defend_terrains = function() {
    var home_area, home_defend_area;
    home_defend_area = new MapArea2D(220, 460, 300, 520);
    home_area = this.map.home.area;
    return _.reject(this.map.units_at(home_defend_area), function(unit) {
      return unit instanceof HomeTerrain || unit instanceof Tank;
    });
  };

  HomeTerrain.prototype.delete_defend_terrains = function() {
    return _.each(this.defend_terrains(), function(terrain) {
      return terrain.destroy();
    });
  };

  HomeTerrain.prototype.add_defend_terrains = function(terrain_cls) {
    var area, _i, _len, _ref, _results;
    _ref = [new MapArea2D(220, 460, 260, 480), new MapArea2D(260, 460, 300, 480), new MapArea2D(220, 480, 240, 520), new MapArea2D(280, 480, 300, 520)];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      area = _ref[_i];
      if (_.size(this.map.units_at(area)) === 0) {
        _results.push(this.map.add_terrain(terrain_cls, area));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  HomeTerrain.prototype.setup_defend_terrains = function() {
    this.delete_defend_terrains();
    return this.add_defend_terrains(IronTerrain);
  };

  HomeTerrain.prototype.restore_defend_terrains = function() {
    this.delete_defend_terrains();
    return this.add_defend_terrains(BrickTerrain);
  };

  return HomeTerrain;

})(Terrain);

Tank = (function(_super) {
  __extends(Tank, _super);

  function Tank(map, area) {
    this.map = map;
    this.area = area;
    this.hp = 1;
    this.power = 1;
    this.level = 1;
    this.max_missile = 1;
    this.max_hp = 2;
    this.missiles = [];
    this.ship = false;
    this.guard = false;
    this.initializing = true;
    this.frozen = false;
    Tank.__super__.constructor.call(this, this.map, this.area);
    this.bom_on_destroy = true;
  }

  Tank.prototype.dead = function() {
    return this.hp <= 0;
  };

  Tank.prototype.level_up = function(levels) {
    this.level = _.min([this.level + levels, 3]);
    return this._level_adjust();
  };

  Tank.prototype._level_adjust = function() {
    switch (this.level) {
      case 1:
        this.power = 1;
        this.max_missile = 1;
        break;
      case 2:
        this.power = 1;
        this.hp = _.max([this.hp + 1, this.max_hp]);
        this.max_missile = 2;
        break;
      case 3:
        this.power = 2;
        this.hp = _.max([this.hp + 1, this.max_hp]);
        this.max_missile = 2;
    }
    return this.update_display();
  };

  Tank.prototype.hp_up = function(lives) {
    return this.hp_down(-lives);
  };

  Tank.prototype.hp_down = function(lives) {
    this.hp -= lives;
    if (this.dead()) {
      return this.destroy();
    } else {
      this.level = _.max([1, this.level - 1]);
      return this._level_adjust();
    }
  };

  Tank.prototype.on_ship = function(ship) {
    this.ship = ship;
    return this.update_display();
  };

  Tank.prototype.fire = function() {
    if (!this.can_fire()) {
      return;
    }
    return this.missiles.push(this.map.add_missile(this));
  };

  Tank.prototype.can_fire = function() {
    return _.size(this.missiles) < this.max_missile;
  };

  Tank.prototype.freeze = function() {
    this.frozen = true;
    this.update_display();
    return this.attach_timeout_event((function(_this) {
      return function() {
        _this.frozen = false;
        return _this.update_display();
      };
    })(this), 6000);
  };

  Tank.prototype.handle_move = function(cmd, delta_time) {
    if (!this.frozen) {
      return Tank.__super__.handle_move.call(this, cmd, delta_time);
    }
  };

  Tank.prototype.handle_turn = function(cmd) {
    if (!this.frozen) {
      return Tank.__super__.handle_turn.call(this, cmd);
    }
  };

  Tank.prototype.handle_fire = function(cmd) {
    switch (cmd.type) {
      case "fire":
        return this.fire();
    }
  };

  Tank.prototype.integration = function(delta_time) {
    var cmd, _i, _len, _ref, _results;
    if (this.initializing || this.destroyed) {
      return;
    }
    Tank.__super__.integration.call(this, delta_time);
    _ref = this.commands;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cmd = _ref[_i];
      _results.push(this.handle_fire(cmd));
    }
    return _results;
  };

  Tank.prototype.delete_missile = function(missile) {
    return this.missiles = _.without(this.missiles, missile);
  };

  Tank.prototype.after_new_display = function() {
    Tank.__super__.after_new_display.call(this);
    return this.display_object.afterFrame(4, (function(_this) {
      return function() {
        _this.initializing = false;
        return _this.update_display();
      };
    })(this));
  };

  Tank.prototype.destroy = function() {
    return Tank.__super__.destroy.call(this);
  };

  return Tank;

})(MovableMapUnit2D);

UserTank = (function(_super) {
  __extends(UserTank, _super);

  function UserTank(map, area) {
    this.map = map;
    this.area = area;
    UserTank.__super__.constructor.call(this, this.map, this.area);
    this.guard = false;
  }

  UserTank.prototype.on_guard = function(guard) {
    this.guard = guard;
    if (this.guard) {
      this.attach_timeout_event(((function(_this) {
        return function() {
          return _this.on_guard(false);
        };
      })(this)), 10000);
    }
    return this.update_display();
  };

  UserTank.prototype.speed = 0.13;

  UserTank.prototype.defend = function(missile, destroy_area) {
    var defend_point;
    if (missile.parent instanceof UserTank) {
      if (missile.parent !== this) {
        this.freeze();
      }
      return this.max_defend_point - 1;
    }
    if (this.guard) {
      return this.max_defend_point - 1;
    }
    if (this.ship) {
      this.on_ship(false);
      return this.max_defend_point - 1;
    }
    defend_point = _.min(this.hp, missile.power);
    this.hp_down(missile.power);
    if (this.dead()) {
      this.map.trigger('tank_destroyed', this, missile.parent);
    }
    return defend_point;
  };

  UserTank.prototype.animation_state = function() {
    if (this.initializing) {
      return "tank_born";
    }
    if (this.guard) {
      return "" + (this.type()) + "_lv" + this.level + "_with_guard";
    }
    if (this.frozen) {
      return "" + (this.type()) + "_lv" + this.level + "_frozen";
    }
    if (this.ship) {
      return "" + (this.type()) + "_lv" + this.level + "_with_ship";
    }
    return "" + (this.type()) + "_lv" + this.level;
  };

  UserTank.prototype.accept = function(map_unit) {
    return (map_unit instanceof Missile) && (map_unit.parent === this);
  };

  return UserTank;

})(Tank);

UserP1Tank = (function(_super) {
  __extends(UserP1Tank, _super);

  function UserP1Tank(map, area) {
    this.map = map;
    this.area = area;
    UserP1Tank.__super__.constructor.call(this, this.map, this.area);
    this.commander = new UserCommander(this, {
      up: 38,
      down: 40,
      left: 37,
      right: 39,
      fire: 32
    });
  }

  UserP1Tank.prototype.type = function() {
    return 'user_p1';
  };

  return UserP1Tank;

})(UserTank);

UserP2Tank = (function(_super) {
  __extends(UserP2Tank, _super);

  function UserP2Tank(map, area) {
    this.map = map;
    this.area = area;
    UserP2Tank.__super__.constructor.call(this, this.map, this.area);
    this.commander = new UserCommander(this, {
      up: 87,
      down: 83,
      left: 65,
      right: 68,
      fire: 74
    });
  }

  UserP2Tank.prototype.type = function() {
    return 'user_p2';
  };

  return UserP2Tank;

})(UserTank);

EnemyTank = (function(_super) {
  __extends(EnemyTank, _super);

  function EnemyTank(map, area) {
    this.map = map;
    this.area = area;
    EnemyTank.__super__.constructor.call(this, this.map, this.area);
    this.max_hp = 5;
    this.hp = 1 + parseInt(Math.random() * (this.max_hp - 1));
    this.iq = 20;
    this.gift_counts = parseInt(Math.random() * this.max_hp / 2);
    this.direction = 180;
    this.commander = new EnemyAICommander(this);
  }

  EnemyTank.prototype.hp_down = function(lives) {
    if (this.gift_counts > 0) {
      this.map.random_gift();
    }
    this.gift_counts -= lives;
    return EnemyTank.__super__.hp_down.call(this, lives);
  };

  EnemyTank.prototype.defend = function(missile, destroy_area) {
    var defend_point;
    if (missile.parent instanceof EnemyTank) {
      return this.max_defend_point - 1;
    }
    if (this.ship) {
      this.on_ship(false);
      return this.max_defend_point - 1;
    }
    defend_point = _.min(this.hp, missile.power);
    this.hp_down(missile.power);
    if (this.dead()) {
      this.map.trigger('tank_destroyed', this, missile.parent);
    }
    return defend_point;
  };

  EnemyTank.prototype.animation_state = function() {
    var prefix;
    if (this.initializing) {
      return "tank_born";
    }
    prefix = this.level === 3 ? 'enemy_lv3' : this.gift_counts > 0 ? "" + (this.type()) + "_with_gift" : ("" + (this.type()) + "_hp") + _.min([this.hp, 4]);
    return prefix + (this.ship ? "_with_ship" : "");
  };

  EnemyTank.prototype.gift_up = function(gifts) {
    return this.gift_counts += gifts;
  };

  EnemyTank.prototype.handle_fire = function(cmd) {
    if (!this.frozen) {
      return EnemyTank.__super__.handle_fire.call(this, cmd);
    }
  };

  EnemyTank.prototype.accept = function(map_unit) {
    return map_unit instanceof EnemyTank || ((map_unit instanceof Missile) && (map_unit.parent instanceof EnemyTank));
  };

  return EnemyTank;

})(Tank);

StupidTank = (function(_super) {
  __extends(StupidTank, _super);

  function StupidTank() {
    return StupidTank.__super__.constructor.apply(this, arguments);
  }

  StupidTank.prototype.speed = 0.07;

  StupidTank.prototype.type = function() {
    return 'stupid';
  };

  return StupidTank;

})(EnemyTank);

FoolTank = (function(_super) {
  __extends(FoolTank, _super);

  function FoolTank() {
    return FoolTank.__super__.constructor.apply(this, arguments);
  }

  FoolTank.prototype.speed = 0.07;

  FoolTank.prototype.type = function() {
    return 'fool';
  };

  return FoolTank;

})(EnemyTank);

FishTank = (function(_super) {
  __extends(FishTank, _super);

  function FishTank() {
    return FishTank.__super__.constructor.apply(this, arguments);
  }

  FishTank.prototype.speed = 0.13;

  FishTank.prototype.type = function() {
    return 'fish';
  };

  return FishTank;

})(EnemyTank);

StrongTank = (function(_super) {
  __extends(StrongTank, _super);

  function StrongTank() {
    return StrongTank.__super__.constructor.apply(this, arguments);
  }

  StrongTank.prototype.speed = 0.07;

  StrongTank.prototype.type = function() {
    return 'strong';
  };

  return StrongTank;

})(EnemyTank);

Missile = (function(_super) {
  __extends(Missile, _super);

  Missile.prototype.speed = 0.20;

  function Missile(map, parent) {
    this.map = map;
    this.parent = parent;
    this.area = this.born_area(this.parent);
    Missile.__super__.constructor.call(this, this.map, this.area);
    this.power = this.parent.power;
    this.energy = this.power;
    this.direction = this.parent.direction;
    this.exploded = false;
    this.commander = new MissileCommander(this);
  }

  Missile.prototype.born_area = function(parent) {
    switch (parent.direction) {
      case Direction.UP:
        return new MapArea2D(parent.area.x1 + this.map.default_width / 4, parent.area.y1, parent.area.x2 - this.map.default_width / 4, parent.area.y1 + this.map.default_height / 2);
      case Direction.DOWN:
        return new MapArea2D(parent.area.x1 + this.map.default_width / 4, parent.area.y2 - this.map.default_height / 2, parent.area.x2 - this.map.default_width / 4, parent.area.y2);
      case Direction.LEFT:
        return new MapArea2D(parent.area.x1, parent.area.y1 + this.map.default_height / 4, parent.area.x1 + this.map.default_width / 2, parent.area.y2 - this.map.default_height / 4);
      case Direction.RIGHT:
        return new MapArea2D(parent.area.x2 - this.map.default_width / 2, parent.area.y1 + this.map.default_height / 4, parent.area.x2, parent.area.y2 - this.map.default_height / 4);
    }
  };

  Missile.prototype.type = function() {
    return 'missile';
  };

  Missile.prototype.explode = function() {
    return this.exploded = true;
  };

  Missile.prototype.destroy = function() {
    Missile.__super__.destroy.call(this);
    return this.parent.delete_missile(this);
  };

  Missile.prototype.animation_state = function() {
    return 'missile';
  };

  Missile.prototype.move = function(offset) {
    var can_move;
    can_move = Missile.__super__.move.call(this, offset);
    if (!can_move) {
      this.attack();
    }
    return can_move;
  };

  Missile.prototype.attack = function() {
    var destroy_area, hit_map_units;
    destroy_area = this.destroy_area();
    if (this.map.out_of_bound(destroy_area)) {
      this.bom_on_destroy = true;
      this.energy -= this.max_defend_point;
    } else {
      hit_map_units = this.map.units_at(destroy_area);
      _.each(hit_map_units, (function(_this) {
        return function(unit) {
          var defend_point;
          defend_point = unit.defend(_this, destroy_area);
          _this.bom_on_destroy = defend_point === _this.max_defend_point;
          return _this.energy -= defend_point;
        };
      })(this));
    }
    if (this.energy <= 0) {
      return this.destroy();
    }
  };

  Missile.prototype.destroy_area = function() {
    switch (this.direction) {
      case Direction.UP:
        return new MapArea2D(this.area.x1 - this.default_width / 4, this.area.y1 - this.default_height / 4, this.area.x2 + this.default_width / 4, this.area.y1);
      case Direction.RIGHT:
        return new MapArea2D(this.area.x2, this.area.y1 - this.default_height / 4, this.area.x2 + this.default_width / 4, this.area.y2 + this.default_height / 4);
      case Direction.DOWN:
        return new MapArea2D(this.area.x1 - this.default_width / 4, this.area.y2, this.area.x2 + this.default_width / 4, this.area.y2 + this.default_height / 4);
      case Direction.LEFT:
        return new MapArea2D(this.area.x1 - this.default_width / 4, this.area.y1 - this.default_height / 4, this.area.x1, this.area.y2 + this.default_height / 4);
    }
  };

  Missile.prototype.defend = function(missile, destroy_area) {
    this.destroy();
    return this.max_defend_point - 1;
  };

  Missile.prototype.accept = function(map_unit) {
    return map_unit === this.parent || (map_unit instanceof Missile && map_unit.parent === this.parent);
  };

  return Missile;

})(MovableMapUnit2D);

Gift = (function(_super) {
  __extends(Gift, _super);

  function Gift() {
    return Gift.__super__.constructor.apply(this, arguments);
  }

  Gift.prototype.group = 'gift';

  Gift.prototype.accept = function(map_unit) {
    return true;
  };

  Gift.prototype.defend = function(missile, destroy_area) {
    return 0;
  };

  Gift.prototype.integration = function(delta_time) {
    var tanks;
    if (this.destroyed) {
      return;
    }
    tanks = _.select(this.map.units_at(this.area), function(unit) {
      return unit instanceof Tank;
    });
    _.each(tanks, (function(_this) {
      return function(tank) {
        return _this.apply(tank);
      };
    })(this));
    if (_.size(tanks) > 0) {
      this.destroy();
      return this.map.trigger('gift_consumed', this, tanks);
    }
  };

  Gift.prototype.apply = function(tank) {};

  Gift.prototype.new_display = function() {
    return this.display_object = new Kinetic.Sprite({
      x: this.area.x1,
      y: this.area.y1,
      image: this.map.image,
      animation: this.animation_state(),
      animations: Animations.gifts,
      frameRate: Animations.rate(this.animation_state()),
      index: 0,
      map_unit: this
    });
  };

  Gift.prototype.animation_state = function() {
    return this.type();
  };

  return Gift;

})(MapUnit2D);

LandMineGift = (function(_super) {
  __extends(LandMineGift, _super);

  function LandMineGift() {
    return LandMineGift.__super__.constructor.apply(this, arguments);
  }

  LandMineGift.prototype.apply = function(tank) {
    if (tank instanceof EnemyTank) {
      return _.each(this.map.user_tanks(), (function(_this) {
        return function(tank) {
          tank.destroy();
          return _this.map.trigger('tank_destroyed', tank, null);
        };
      })(this));
    } else {
      return _.each(this.map.enemy_tanks(), (function(_this) {
        return function(tank) {
          tank.destroy();
          return _this.map.trigger('tank_destroyed', tank, null);
        };
      })(this));
    }
  };

  LandMineGift.prototype.type = function() {
    return 'land_mine';
  };

  return LandMineGift;

})(Gift);

GunGift = (function(_super) {
  __extends(GunGift, _super);

  function GunGift() {
    return GunGift.__super__.constructor.apply(this, arguments);
  }

  GunGift.prototype.apply = function(tank) {
    return tank.level_up(2);
  };

  GunGift.prototype.type = function() {
    return 'gun';
  };

  return GunGift;

})(Gift);

ShipGift = (function(_super) {
  __extends(ShipGift, _super);

  function ShipGift() {
    return ShipGift.__super__.constructor.apply(this, arguments);
  }

  ShipGift.prototype.apply = function(tank) {
    return tank.on_ship(true);
  };

  ShipGift.prototype.type = function() {
    return 'ship';
  };

  return ShipGift;

})(Gift);

StarGift = (function(_super) {
  __extends(StarGift, _super);

  function StarGift() {
    return StarGift.__super__.constructor.apply(this, arguments);
  }

  StarGift.prototype.apply = function(tank) {
    return tank.level_up(1);
  };

  StarGift.prototype.type = function() {
    return 'star';
  };

  return StarGift;

})(Gift);

ShovelGift = (function(_super) {
  __extends(ShovelGift, _super);

  function ShovelGift() {
    return ShovelGift.__super__.constructor.apply(this, arguments);
  }

  ShovelGift.prototype.apply = function(tank) {
    if (tank instanceof UserTank) {
      this.map.home().setup_defend_terrains();
    } else {
      this.map.home().delete_defend_terrains();
    }
    return this.attach_timeout_event((function(_this) {
      return function() {
        return _this.map.home().restore_defend_terrains();
      };
    })(this), 10000);
  };

  ShovelGift.prototype.type = function() {
    return 'shovel';
  };

  return ShovelGift;

})(Gift);

LifeGift = (function(_super) {
  __extends(LifeGift, _super);

  function LifeGift() {
    return LifeGift.__super__.constructor.apply(this, arguments);
  }

  LifeGift.prototype.apply = function(tank) {
    if (tank instanceof EnemyTank) {
      return _.each(this.map.enemy_tanks(), function(enemy_tank) {
        tank.hp_up(5);
        return tank.gift_up(3);
      });
    } else {
      return this.map.trigger('tank_life_up', tank);
    }
  };

  LifeGift.prototype.type = function() {
    return 'life';
  };

  return LifeGift;

})(Gift);

HatGift = (function(_super) {
  __extends(HatGift, _super);

  function HatGift() {
    return HatGift.__super__.constructor.apply(this, arguments);
  }

  HatGift.prototype.apply = function(tank) {
    if (tank instanceof EnemyTank) {
      return tank.hp_up(5);
    } else {
      return tank.on_guard(true);
    }
  };

  HatGift.prototype.type = function() {
    return 'hat';
  };

  return HatGift;

})(Gift);

ClockGift = (function(_super) {
  __extends(ClockGift, _super);

  function ClockGift() {
    return ClockGift.__super__.constructor.apply(this, arguments);
  }

  ClockGift.prototype.apply = function(tank) {
    if (tank instanceof EnemyTank) {
      return _.each(this.map.user_tanks(), function(tank) {
        return tank.freeze();
      });
    } else {
      return _.each(this.map.enemy_tanks(), function(tank) {
        return tank.freeze();
      });
    }
  };

  ClockGift.prototype.type = function() {
    return 'clock';
  };

  return ClockGift;

})(Gift);

Commander = (function() {
  function Commander(map_unit) {
    this.map_unit = map_unit;
    this.direction = this.map_unit.direction;
    this.commands = [];
  }

  Commander.prototype.direction_action_map = {
    up: Direction.UP,
    down: Direction.DOWN,
    left: Direction.LEFT,
    right: Direction.RIGHT
  };

  Commander.prototype.next = function() {};

  Commander.prototype.next_commands = function() {
    this.commands = [];
    this.next();
    return _.uniq(this.commands, function(command) {
      if (command['type'] === "direction") {
        return command['params']['direction'];
      }
      return command['type'];
    });
  };

  Commander.prototype.direction_changed = function(action) {
    var new_direction;
    new_direction = this.direction_action_map[action];
    return this.map_unit.direction !== new_direction;
  };

  Commander.prototype.turn = function(action) {
    var new_direction;
    new_direction = this.direction_action_map[action];
    return this.commands.push(this._direction_command(new_direction));
  };

  Commander.prototype.start_move = function(offset) {
    if (offset == null) {
      offset = null;
    }
    return this.commands.push(this._start_move_command(offset));
  };

  Commander.prototype.stop_move = function() {
    return this.commands.push(this._stop_move_command());
  };

  Commander.prototype.fire = function() {
    return this.commands.push(this._fire_command());
  };

  Commander.prototype._direction_command = function(direction) {
    return {
      type: "direction",
      params: {
        direction: direction
      }
    };
  };

  Commander.prototype._start_move_command = function(offset) {
    if (offset == null) {
      offset = null;
    }
    return {
      type: "start_move",
      params: {
        offset: offset
      }
    };
  };

  Commander.prototype._stop_move_command = function() {
    return {
      type: "stop_move"
    };
  };

  Commander.prototype._fire_command = function() {
    return {
      type: "fire"
    };
  };

  return Commander;

})();

UserCommander = (function(_super) {
  __extends(UserCommander, _super);

  function UserCommander(map_unit, key_setting) {
    var code, key;
    this.map_unit = map_unit;
    UserCommander.__super__.constructor.call(this, this.map_unit);
    this.key_map = {};
    for (key in key_setting) {
      code = key_setting[key];
      this.key_map[code] = key;
    }
    this.reset();
  }

  UserCommander.prototype.reset = function() {
    this.key_status = {
      up: false,
      down: false,
      left: false,
      right: false,
      fire: false
    };
    return this.inputs = {
      up: [],
      down: [],
      left: [],
      right: [],
      fire: []
    };
  };

  UserCommander.prototype.is_pressed = function(key) {
    return this.key_status[key];
  };

  UserCommander.prototype.set_pressed = function(key, bool) {
    return this.key_status[key] = bool;
  };

  UserCommander.prototype.next = function() {
    this.handle_key_up_key_down();
    return this.handle_key_press();
  };

  UserCommander.prototype.handle_key_up_key_down = function() {
    var key, keydown, keyup, types, _ref;
    _ref = this.inputs;
    for (key in _ref) {
      types = _ref[key];
      if (_.isEmpty(types)) {
        continue;
      }
      switch (key) {
        case "fire":
          this.fire();
          break;
        case "up":
        case "down":
        case "left":
        case "right":
          if (this.direction_changed(key)) {
            this.turn(key);
            break;
          }
          keyup = _.contains(this.inputs[key], "keyup");
          keydown = _.contains(this.inputs[key], "keydown");
          if (keydown) {
            this.start_move();
          } else {
            if (keyup) {
              this.stop_move();
            }
          }
      }
    }
    return this.inputs = {
      up: [],
      down: [],
      left: [],
      right: [],
      fire: []
    };
  };

  UserCommander.prototype.handle_key_press = function() {
    var key, _i, _len, _ref;
    _ref = ["up", "down", "left", "right"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (this.is_pressed(key)) {
        this.turn(key);
        this.start_move();
      }
    }
    if (this.is_pressed("fire")) {
      return this.fire();
    }
  };

  UserCommander.prototype.add_key_event = function(type, key_code) {
    var key;
    if (_.isUndefined(this.key_map[key_code])) {
      return true;
    }
    key = this.key_map[key_code];
    switch (type) {
      case "keyup":
        this.set_pressed(key, false);
        return this.inputs[key].push("keyup");
      case "keydown":
        this.set_pressed(key, true);
        return this.inputs[key].push("keydown");
    }
  };

  return UserCommander;

})(Commander);

EnemyAICommander = (function(_super) {
  __extends(EnemyAICommander, _super);

  function EnemyAICommander(map_unit) {
    this.map_unit = map_unit;
    EnemyAICommander.__super__.constructor.call(this, this.map_unit);
    this.map = this.map_unit.map;
    this.reset_path();
    this.last_area = null;
  }

  EnemyAICommander.prototype.next = function() {
    var end_vertex;
    if (_.size(this.path) === 0) {
      end_vertex = (Math.random() * 100) <= this.map_unit.iq ? this.map.home_vertex : this.map.random_vertex();
      this.path = this.map.shortest_path(this.map_unit, this.current_vertex(), end_vertex);
      this.next_move();
      setTimeout(((function(_this) {
        return function() {
          return _this.reset_path();
        };
      })(this)), 2000 + Math.random() * 2000);
    } else {
      if (this.current_vertex().equals(this.target_vertex)) {
        this.next_move();
      }
    }
    if (this.map_unit.can_fire() && this.last_area && this.last_area.equals(this.map_unit.area)) {
      if (Math.random() < 0.08) {
        this.fire();
      }
    } else {
      if (Math.random() < 0.01) {
        this.fire();
      }
    }
    return this.last_area = this.map_unit.area;
  };

  EnemyAICommander.prototype.next_move = function() {
    var direction, offset, _ref;
    if (_.size(this.map_unit.delayed_commands) > 0) {
      return;
    }
    if (_.size(this.path) === 0) {
      return;
    }
    this.target_vertex = this.path.shift();
    _ref = this.offset_of(this.current_vertex(), this.target_vertex), direction = _ref[0], offset = _ref[1];
    this.turn(direction);
    return this.start_move(offset);
  };

  EnemyAICommander.prototype.reset_path = function() {
    return this.path = [];
  };

  EnemyAICommander.prototype.offset_of = function(current_vertex, target_vertex) {
    if (target_vertex.y1 < current_vertex.y1) {
      return ["up", current_vertex.y1 - target_vertex.y1];
    }
    if (target_vertex.y1 > current_vertex.y1) {
      return ["down", target_vertex.y1 - current_vertex.y1];
    }
    if (target_vertex.x1 < current_vertex.x1) {
      return ["left", current_vertex.x1 - target_vertex.x1];
    }
    if (target_vertex.x1 > current_vertex.x1) {
      return ["right", target_vertex.x1 - current_vertex.x1];
    }
    return ["down", 0];
  };

  EnemyAICommander.prototype.current_vertex = function() {
    return this.map.vertexes_at(this.map_unit.area);
  };

  EnemyAICommander.prototype.in_attack_range = function(area) {
    return this.map_unit.area.x1 === area.x1 || this.map_unit.area.y1 === area.y1;
  };

  return EnemyAICommander;

})(Commander);

MissileCommander = (function(_super) {
  __extends(MissileCommander, _super);

  function MissileCommander() {
    return MissileCommander.__super__.constructor.apply(this, arguments);
  }

  MissileCommander.prototype.next = function() {
    return this.start_move();
  };

  return MissileCommander;

})(Commander);
