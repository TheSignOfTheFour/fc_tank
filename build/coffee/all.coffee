class BinomialHeapNode
  constructor: (@satellite, @key) ->
    @parent = null
    @degree = 0
    @child = null
    @sibling = null
    @prev_sibling = null
  link: (node) ->
    @parent = node
    @sibling = node.child
    @sibling.prev_sibling = this if @sibling != null
    @prev_sibling = null
    node.child = this
    node.degree += 1
  is_head: () ->
    @parent == null and @prev_sibling == null
  is_first_child: () ->
    @parent != null and @prev_sibling == null

class BinomialHeap
  constructor: (@head = null) ->
  is_empty: () -> @head == null
  insert: (node) -> @union(new BinomialHeap(node))
  min: () ->
    y = null
    x = @head
    min = Infinity
    while x != null
      if x.key < min
        min = x.key
        y = x
      x = x.sibling
    y
  _extract_min_root_node: () ->
    # find min in the root list
    [curr, min] = [@head, @head]
    until curr == null
      min = curr if curr.key < min.key
      curr = curr.sibling
    # remove min from root list
    if min.is_head()
      @head = min.sibling
    else
      min.prev_sibling.sibling = min.sibling
    min.sibling.prev_sibling = min.prev_sibling if min.sibling != null
    [min.sibling, min.prev_sibling] = [null, null]
    min
  extract_min: () ->
    return null if @is_empty()
    min = @_extract_min_root_node()
    curr = min.child
    if curr != null
      until curr == null
        [curr.prev_sibling, curr.sibling, curr.parent] =
          [curr.sibling, curr.prev_sibling, null]
        @union(new BinomialHeap(curr)) if curr.is_head()
        curr = curr.prev_sibling
    min.parent = null
    min.child = null
    min.degree = 0
    min
  union: (heap) ->
    @merge(heap)
    return if @is_empty()
    prev_x = null
    x = @head
    next_x = x.sibling
    while next_x != null
      if x.degree != next_x.degree or
          (next_x.sibling != null and next_x.sibling.degree == x.degree)
        prev_x = x
        x = next_x
      else if x.key <= next_x.key
        x.sibling = next_x.sibling
        x.sibling.prev_sibling = x if x.sibling != null
        next_x.link(x)
      else
        if prev_x == null
          @head = next_x
          @head.prev_sibling = null
        else
          prev_x.sibling = next_x
          prev_x.sibling.prev_sibling = prev_x if prev_x.sibling != null
        x.link(next_x)
      next_x = x.sibling
    this
  decrease_key: (node, new_key) ->
    if new_key > node.key
      throw new Error("new key is greater than current key")
    node.key = new_key
    y = node
    z = y.parent
    while z != null and y.key < z.key
      y.parent.child = z if y.is_first_child()
      z.parent.child = y if z.is_first_child()
      [y.parent, z.parent] = [z.parent, y.parent]

      y.prev_sibling.sibling = z if y.prev_sibling != null
      z.prev_sibling.sibling = y if z.prev_sibling != null
      [y.prev_sibling, z.prev_sibling] = [z.prev_sibling, y.prev_sibling]

      y.sibling.prev_sibling = z if y.sibling != null
      z.sibling.prev_sibling = y if z.sibling != null
      [y.sibling, z.sibling] = [z.sibling, y.sibling]

      child = y.child
      until child == null
        child.parent = z
        child = child.sibling
      child = z.child
      until child == null
        child.parent = y
        child = child.sibling
      [y.child, z.child] = [z.child, y.child]
      [y.degree, z.degree] = [z.degree, y.degree]

      @head = y if y.is_head()
      z = y.parent
  delete: (node) ->
    @decrease_key(node, -Infinity)
    @extract_min()
  merge: (heap) ->
    return if heap.is_empty()
    if @is_empty()
      @head = heap.head
      return

    p1 = @head
    p2 = heap.head

    if p1.degree < p2.degree
      @head = p1
      p1 = p1.sibling
    else
      @head = p2
      p2 = p2.sibling
    curr = @head

    while p1 != null or p2 != null
      if p1 == null
        curr.sibling = p2
        p2.prev_sibling = curr if p2 != null
        break
      else if p2 == null
        curr.sibling = p1
        p1.prev_sibling = curr if p1 != null
        break
      else if p1.degree < p2.degree
        curr.sibling = p1
        p1.prev_sibling = curr
        curr = p1
        p1 = p1.sibling
      else
        curr.sibling = p2
        p2.prev_sibling = curr
        curr = p2
        p2 = p2.sibling
    this

$ ->
  game = new Game()
  window.game = game
  game.kick_off()

class Direction
  @UP: 0
  @DOWN: 180
  @LEFT: 270
  @RIGHT: 90
  @all: () -> [@UP, @DOWN, @LEFT, @RIGHT]

class Animations
  @movables: {
    bom: [
      {x: 360, y: 340, width: 40, height: 40},
      {x: 120, y: 340, width: 40, height: 40},
      {x: 160, y: 340, width: 40, height: 40},
      {x: 200, y: 340, width: 40, height: 40}
    ],
    tank_born: [
      {x: 360, y: 340, width: 40, height: 40},
      {x: 0, y: 340, width: 40, height: 40},
      {x: 40, y: 340, width: 40, height: 40},
      {x: 0, y: 340, width: 40, height: 40},
      {x: 80, y: 340, width: 40, height: 40}
    ],
    user_p1_lv1: [
      {x: 0, y: 0, width: 40, height: 40}
    ],
    user_p1_lv1_frozen: [
      {x: 0, y: 0, width: 40, height: 40},
      {x: 0, y: 0, width: 40, height: 40},
      {x: 360, y: 320, width: 40, height: 40}
    ],
    user_p1_lv1_with_ship: [
      {x: 40, y: 0, width: 40, height: 40}
    ],
    user_p1_lv1_with_guard: [
      {x: 0, y: 0, width: 40, height: 40},
      {x: 80, y: 0, width: 40, height: 40}
    ],
    user_p1_lv2: [
      {x: 120, y: 0, width: 40, height: 40}
    ],
    user_p1_lv2_frozen: [
      {x: 120, y: 0, width: 40, height: 40},
      {x: 120, y: 0, width: 40, height: 40},
      {x: 360, y: 320, width: 40, height: 40}
    ],
    user_p1_lv2_with_ship: [
      {x: 160, y: 0, width: 40, height: 40}
    ],
    user_p1_lv2_with_guard: [
      {x: 120, y: 0, width: 40, height: 40},
      {x: 200, y: 0, width: 40, height: 40}
    ],
    user_p1_lv3: [
      {x: 240, y: 0, width: 40, height: 40}
    ],
    user_p1_lv3_frozen: [
      {x: 240, y: 0, width: 40, height: 40},
      {x: 240, y: 0, width: 40, height: 40},
      {x: 360, y: 320, width: 40, height: 40}
    ],
    user_p1_lv3_with_ship: [
      {x: 280, y: 0, width: 40, height: 40}
    ],
    user_p1_lv3_with_guard: [
      {x: 240, y: 0, width: 40, height: 40},
      {x: 320, y: 0, width: 40, height: 40}
    ],
    user_p2_lv1: [
      {x: 0, y: 40, width: 40, height: 40}
    ],
    user_p2_lv1_frozen: [
      {x: 0, y: 40, width: 40, height: 40},
      {x: 0, y: 40, width: 40, height: 40},
      {x: 360, y: 320, width: 40, height: 40}
    ],
    user_p2_lv1_with_ship: [
      {x: 40, y: 40, width: 40, height: 40}
    ],
    user_p2_lv1_with_guard: [
      {x: 0, y: 40, width: 40, height: 40},
      {x: 80, y: 40, width: 40, height: 40}
    ],
    user_p2_lv2: [
      {x: 120, y: 40, width: 40, height: 40}
    ],
    user_p2_lv2_frozen: [
      {x: 120, y: 40, width: 40, height: 40},
      {x: 120, y: 40, width: 40, height: 40},
      {x: 360, y: 320, width: 40, height: 40}
    ],
    user_p2_lv2_with_ship: [
      {x: 160, y: 40, width: 40, height: 40}
    ],
    user_p2_lv2_with_guard: [
      {x: 120, y: 40, width: 40, height: 40},
      {x: 200, y: 40, width: 40, height: 40}
    ],
    user_p2_lv3: [
      {x: 240, y: 40, width: 40, height: 40}
    ],
    user_p2_lv3_frozen: [
      {x: 240, y: 40, width: 40, height: 40},
      {x: 240, y: 40, width: 40, height: 40},
      {x: 360, y: 320, width: 40, height: 40}
    ],
    user_p2_lv3_with_ship: [
      {x: 280, y: 40, width: 40, height: 40}
    ],
    user_p2_lv3_with_guard: [
      {x: 240, y: 40, width: 40, height: 40},
      {x: 320, y: 40, width: 40, height: 40}
    ],
    enemy_lv3: [
      {x: 360, y: 0, width: 40, height: 40}
    ],
    enemy_lv3_with_ship: [
      {x: 360, y: 40, width: 40, height: 40}
    ],
    stupid_hp1: [
      {x: 0, y: 80, width: 40, height: 40}
    ],
    stupid_hp1_with_ship: [
      {x: 40, y: 80, width: 40, height: 40}
    ],
    stupid_hp2: [
      {x: 80, y: 80, width: 40, height: 40}
    ],
    stupid_hp2_with_ship: [
      {x: 120, y: 80, width: 40, height: 40}
    ],
    stupid_hp3: [
      {x: 160, y: 80, width: 40, height: 40}
    ],
    stupid_hp3_with_ship: [
      {x: 200, y: 80, width: 40, height: 40}
    ],
    stupid_hp4: [
      {x: 240, y: 80, width: 40, height: 40}
    ],
    stupid_hp4_with_ship: [
      {x: 280, y: 80, width: 40, height: 40}
    ],
    stupid_with_gift: [
      {x: 320, y: 80, width: 40, height: 40},
      {x: 320, y: 80, width: 40, height: 40},
      {x: 0, y: 80, width: 40, height: 40}
    ],
    stupid_with_gift_with_ship: [
      {x: 360, y: 80, width: 40, height: 40},
      {x: 40, y: 80, width: 40, height: 40}
    ],
    fool_hp1: [
      {x: 0, y: 120, width: 40, height: 40}
    ],
    fool_hp1_with_ship: [
      {x: 40, y: 120, width: 40, height: 40}
    ],
    fool_hp2: [
      {x: 80, y: 120, width: 40, height: 40}
    ],
    fool_hp2_with_ship: [
      {x: 120, y: 120, width: 40, height: 40}
    ],
    fool_hp3: [
      {x: 160, y: 120, width: 40, height: 40}
    ],
    fool_hp3_with_ship: [
      {x: 200, y: 120, width: 40, height: 40}
    ],
    fool_hp4: [
      {x: 240, y: 120, width: 40, height: 40}
    ],
    fool_hp4_with_ship: [
      {x: 280, y: 120, width: 40, height: 40}
    ],
    fool_with_gift: [
      {x: 320, y: 120, width: 40, height: 40},
      {x: 320, y: 120, width: 40, height: 40},
      {x: 0, y: 120, width: 40, height: 40}
    ],
    fool_with_gift_with_ship: [
      {x: 360, y: 120, width: 40, height: 40},
      {x: 40, y: 120, width: 40, height: 40}
    ],
    fish_hp1: [
      {x: 0, y: 160, width: 40, height: 40}
    ],
    fish_hp1_with_ship: [
      {x: 40, y: 160, width: 40, height: 40}
    ],
    fish_hp2: [
      {x: 80, y: 160, width: 40, height: 40}
    ],
    fish_hp2_with_ship: [
      {x: 120, y: 160, width: 40, height: 40}
    ],
    fish_hp3: [
      {x: 160, y: 160, width: 40, height: 40}
    ],
    fish_hp3_with_ship: [
      {x: 200, y: 160, width: 40, height: 40}
    ],
    fish_hp4: [
      {x: 240, y: 160, width: 40, height: 40}
    ],
    fish_hp4_with_ship: [
      {x: 280, y: 160, width: 40, height: 40}
    ],
    fish_with_gift: [
      {x: 320, y: 160, width: 40, height: 40},
      {x: 320, y: 160, width: 40, height: 40},
      {x: 0, y: 160, width: 40, height: 40}
    ],
    fish_with_gift_with_ship: [
      {x: 360, y: 160, width: 40, height: 40},
      {x: 40, y: 160, width: 40, height: 40}
    ],
    strong_hp1: [
      {x: 0, y: 200, width: 40, height: 40}
    ],
    strong_hp1_with_ship: [
      {x: 40, y: 200, width: 40, height: 40}
    ],
    strong_hp2: [
      {x: 80, y: 200, width: 40, height: 40}
    ],
    strong_hp2_with_ship: [
      {x: 120, y: 200, width: 40, height: 40}
    ],
    strong_hp3: [
      {x: 160, y: 200, width: 40, height: 40}
    ],
    strong_hp3_with_ship: [
      {x: 200, y: 200, width: 40, height: 40}
    ],
    strong_hp4: [
      {x: 240, y: 200, width: 40, height: 40}
    ],
    strong_hp4_with_ship: [
      {x: 280, y: 200, width: 40, height: 40}
    ],
    strong_with_gift: [
      {x: 320, y: 200, width: 40, height: 40},
      {x: 320, y: 200, width: 40, height: 40},
      {x: 0, y: 200, width: 40, height: 40}
    ],
    strong_with_gift_with_ship: [
      {x: 360, y: 200, width: 40, height: 40},
      {x: 40, y: 200, width: 40, height: 40}
    ],
    missile: [{x: 250, y: 350, width: 20, height: 20}]
  }
  @movable: (type) -> @movables[type]

  @gifts: {
    land_mine: [
      {x: 0, y: 300, width: 40, height: 40},
      {x: 360, y: 300, width: 40, height: 40}
    ],
    gun: [
      {x: 80, y: 300, width: 40, height: 40},
      {x: 360, y: 300, width: 40, height: 40}
    ],
    ship: [
      {x: 40, y: 300, width: 40, height: 40},
      {x: 360, y: 300, width: 40, height: 40}
    ],
    star: [
      {x: 160, y: 300, width: 40, height: 40},
      {x: 360, y: 300, width: 40, height: 40}
    ],
    shovel: [
      {x: 120, y: 300, width: 40, height: 40},
      {x: 360, y: 300, width: 40, height: 40}
    ],
    life: [
      {x: 240, y: 300, width: 40, height: 40},
      {x: 360, y: 300, width: 40, height: 40}
    ],
    hat: [
      {x: 200, y: 300, width: 40, height: 40},
      {x: 360, y: 300, width: 40, height: 40}
    ],
    clock: [
      {x: 280, y: 300, width: 40, height: 40},
      {x: 360, y: 300, width: 40, height: 40}
    ]
  }

  @rates: {
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
  }
  @rate: (type) -> @rates[type]

  @terrains: {
    brick: [{x: 0, y: 240, width: 40, height: 40}],
    iron: [{x: 120, y: 240, width: 40, height: 40}],
    water: [{x: 240, y: 240, width: 40, height: 40}],
    ice: [{x: 60, y: 240, width: 40, height: 40}],
    grass: [{x: 180, y: 240, width: 40, height: 40}],
    home_origin: [{x: 320, y: 240, width: 40, height: 40}],
    home_destroyed: [{x: 360, y: 240, width: 40, height: 40}]
  }
  @terrain: (type) -> @terrains[type]


class Game
  constructor: () ->
    @canvas = new Kinetic.Stage({container: 'canvas', width: 600, height: 520})
    @init_default_config()
    @scenes = {
      'welcome': new WelcomeScene(this),
      'stage': new StageScene(this),
      'game': new GameScene(this),
      'report': new ReportScene(this),
      'hi_score': new HiScoreScene(this)
      'online_games': new OnlineGamesScene(this)
    }
    @current_scene = null

  set_config: (key, value) -> @configs[key] = value
  get_config: (key) -> @configs[key]
  init_default_config: () ->
    @configs = {
      fps: 60, players: 1,
      online_games : ['127.0.0.1', '234.22.34.3'],
      curr_menu_game : 0,
      current_stage: 1, stages: 50, stage_autostart: false,
      game_over: false, hi_score: 20000, p1_score: 0, p2_score: 0,
      p1_level: 1, p2_level: 1, p1_lives: 2, p2_lives: 2,
      p1_killed_enemies: [], p2_killed_enemies: [],
      score_for_stupid: 100, score_for_fish: 200,
      score_for_fool: 300, score_for_strong: 400,
      score_for_gift: 500, last_score: 0, enemies_per_stage: 20
    }

  kick_off: () -> @switch_scene('welcome')

  prev_stage: () ->
    @mod_stage(@configs['current_stage'] - 1 + @configs['stages'])

  next_stage: () ->
    @mod_stage(@configs['current_stage'] + 1 + @configs['stages'])

  mod_stage: (next) ->
    if next % @configs['stages'] == 0
      @configs['current_stage'] = @configs['stages']
    else
      @configs['current_stage'] =  next % @configs['stages']
    @configs['current_stage']

  reset: () ->
    _.each @scenes, (scene) -> scene.stop()
    @current_scene = null
    @init_default_config()
    @kick_off()

  switch_scene: (type) ->
    target_scene = @scenes[type]
    @current_scene.stop() unless _.isEmpty(@current_scene)
    target_scene.start()
    @current_scene = target_scene

class Scene
  constructor: (@game) ->
    @layer = new Kinetic.Layer()
    @game.canvas.add(@layer)
    @layer.hide()

  start: () ->
    @layer.show()
    @layer.draw()
  stop: () -> @layer.hide()

class WelcomeScene extends Scene
  constructor: (@game) ->
    super(@game)
    @static_group = new Kinetic.Group()
    @layer.add(@static_group)
    @init_statics()
    @init_logo()
    @init_user_selection()
    @sound = new Howl({urls: ['data/intro.ogg', 'data/intro.mp3']})

  start: () ->
    super()
    @static_group.move(y: -300, x: 0)
    new Kinetic.Tween({
      node: @static_group,
      duration: 1.5,
      y: 0,
      rotationDeg: 0,
      easing: Kinetic.Easings.Linear,
      onFinish: () =>
        @update_players()
        @enable_selection_control()
    }).play()
    @update_numbers()
    #@sound.play()

  stop: () ->
    super()
    @disable_selection_control()
    @prepare_for_game_scene()
    #@sound.stop()

  update_numbers: () ->
    @numbers_label.setText("I- #{@game.get_config('p1_score')}" +
        "  II- #{@game.get_config('p2_score')}" +
        "  HI- #{@game.get_config('hi_score')}")

  prepare_for_game_scene: () ->
    @game.set_config('game_over', false)
    @game.set_config('stage_autostart', false)
    @game.set_config('current_stage', 1)
    @game.set_config('p1_score', 0)
    @game.set_config('p2_score', 0)
    @game.set_config('p1_lives', 2)
    @game.set_config('p2_lives', 2)
    @game.set_config('p1_level', 1)
    @game.set_config('p2_level', 1)

  enable_selection_control: () ->
    $(document).bind "keydown", (event) =>
      switch event.which
        when 13
          # ENTER
          if @game.get_config('players') == 3
            @game.switch_scene('online_games')
          else
            @game.switch_scene('stage')

        when 32
          # SPACE
          @toggle_players()

  disable_selection_control: () ->
    $(document).unbind "keydown"

  toggle_players: () ->
    if @game.get_config('players') == 3
      new_select_position = 1
    else
      new_select_position = @game.get_config('players') + 1
    @game.set_config('players', new_select_position)
    @update_players()

  update_players: () ->
    players = @game.get_config('players')
    @select_tank.setAbsolutePosition x: 170, y: (310 + players * 40)
    @layer.draw()

  init_statics: () ->
    # scores
    @numbers_label = new Kinetic.Text({
      x: 40,
      y: 40,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "I- #{@game.get_config('p1_score')}" +
        "  II- #{@game.get_config('p2_score')}" +
        "  HI- #{@game.get_config('hi_score')}",
      fill: "#fff"
    })
    @static_group.add(@numbers_label)

  init_logo: () ->
    # logo
    image = document.getElementById('tank_sprite')
    for area in [
      # T
      new MapArea2D(80, 100, 120, 110),
      new MapArea2D(120, 100, 140, 110),
      new MapArea2D(100, 110, 120, 140),
      new MapArea2D(100, 140, 120, 170),
      # A
      new MapArea2D(170, 100, 200, 110),
      new MapArea2D(160, 110, 180, 120),
      new MapArea2D(190, 110, 210, 120),
      new MapArea2D(150, 120, 170, 140),
      new MapArea2D(150, 140, 170, 170),
      new MapArea2D(200, 120, 220, 140),
      new MapArea2D(200, 140, 220, 170),
      new MapArea2D(170, 140, 200, 150),
      # N
      new MapArea2D(230, 100, 250, 140),
      new MapArea2D(230, 140, 250, 170),
      new MapArea2D(250, 110, 260, 140),
      new MapArea2D(260, 120, 270, 150),
      new MapArea2D(270, 130, 280, 160),
      new MapArea2D(280, 100, 300, 140),
      new MapArea2D(280, 140, 300, 170),
      # K
      new MapArea2D(310, 100, 330, 140),
      new MapArea2D(310, 140, 330, 170),
      new MapArea2D(360, 100, 380, 110),
      new MapArea2D(350, 110, 370, 120),
      new MapArea2D(340, 120, 360, 130),
      new MapArea2D(330, 130, 350, 140),
      new MapArea2D(330, 140, 360, 150),
      new MapArea2D(340, 150, 370, 160),
      new MapArea2D(350, 160, 380, 170),
      # C - means coffee
      new MapArea2D(440, 100, 490, 110),
      new MapArea2D(430, 110, 450, 120),
      new MapArea2D(480, 110, 500, 120),
      new MapArea2D(420, 120, 440, 130),
      new MapArea2D(420, 130, 440, 140),
      new MapArea2D(420, 140, 440, 150),
      new MapArea2D(430, 150, 450, 160),
      new MapArea2D(480, 150, 500, 160),
      new MapArea2D(440, 160, 490, 170),

      # 1
      new MapArea2D(180, 210, 200, 220),
      new MapArea2D(170, 220, 200, 230),
      new MapArea2D(180, 230, 200, 250),
      new MapArea2D(180, 250, 200, 270),
      new MapArea2D(160, 270, 200, 280),
      new MapArea2D(200, 270, 220, 280),
      # 9
      new MapArea2D(240, 210, 260, 220),
      new MapArea2D(260, 210, 290, 220),
      new MapArea2D(230, 220, 250, 240),
      new MapArea2D(280, 220, 300, 240),
      new MapArea2D(240, 240, 260, 250),
      new MapArea2D(260, 240, 300, 250),
      new MapArea2D(280, 250, 300, 260),
      new MapArea2D(270, 260, 290, 270),
      new MapArea2D(240, 270, 280, 280),
      # 9
      new MapArea2D(320, 210, 340, 220),
      new MapArea2D(340, 210, 370, 220),
      new MapArea2D(310, 220, 330, 240),
      new MapArea2D(360, 220, 380, 240),
      new MapArea2D(320, 240, 340, 250),
      new MapArea2D(340, 240, 380, 250),
      new MapArea2D(360, 250, 380, 260),
      new MapArea2D(350, 260, 370, 270),
      new MapArea2D(320, 270, 360, 280),
      # 0
      new MapArea2D(410, 210, 440, 220),
      new MapArea2D(400, 220, 410, 230),
      new MapArea2D(430, 220, 450, 230),
      new MapArea2D(390, 230, 410, 260),
      new MapArea2D(440, 230, 460, 260),
      new MapArea2D(400, 260, 420, 270),
      new MapArea2D(440, 260, 450, 270),
      new MapArea2D(410, 270, 440, 280)
    ]
      animations = Animations.terrain('brick')
      brick_sprite = new Kinetic.Sprite({
        x: area.x1,
        y: area.y1,
        image: image,
        animation: 'standing',
        animations: {
          standing: [
            animations[0].x,
            animations[0].y,
            area.width(),
            area.height()
          ]
        },
        frameRate: 0,
        frameIndex: 0
      })
      animations = null
      @static_group.add(brick_sprite)

  init_user_selection: () ->
    # 1/2 user
    @static_group.add(new Kinetic.Text({
      x: 210,
      y: 340,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "1 PLAYER",
      fill: "#fff"
    }))
    @static_group.add(new Kinetic.Text({
      x: 210,
      y: 380,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "2 PLAYERS",
      fill: "#fff"
    }))
    @static_group.add(new Kinetic.Text({
      x: 210,
      y: 420,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "ONLINE GAMES",
      fill: "#fff"
    }))
    # copy right
    @static_group.add(new Kinetic.Text({
      x: 210,
      y: 460,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "© BEN♥FENG",
      fill: "#fff"
    }))
    # tank
    image = document.getElementById('tank_sprite')
    tank_mov = Animations.movables['user_p1_lv1'][0]
    @select_tank = new Kinetic.Sprite({
      x: 170,
      y: 350,
      image: image,
      animation: 'user_p1_lv1',
      animations: {
        'user_p1_lv1' : [
          tank_mov.x, tank_mov.y, tank_mov.width, tank_mov.height
        ]
      },
      frameRate: Animations.rate('user_p1_lv1'),
      offset: {x: 20, y: 20},
      rotationDeg: 90,
      frameIndex: 0
    })
    tank_mov = null
    @static_group.add(@select_tank)
    @select_tank.start()


class StageScene extends Scene
  constructor: (@game) ->
    super(@game)
    @init_stage_nodes()

  start: () ->
    @current_stage = @game.get_config('current_stage')
    @update_stage_label()
    if @game.get_config('stage_autostart')
      setTimeout((() => @game.switch_scene('game')), 2000)
    else
      @enable_stage_control()
    super()

  stop: () ->
    @disable_stage_control()
    @prepare_for_game_scene()
    super()

  prepare_for_game_scene: () ->
    @game.set_config('p1_killed_enemies', [])
    @game.set_config('p2_killed_enemies', [])

  enable_stage_control: () ->
    $(document).bind "keydown", (event) =>
      switch event.which
        when 37, 38
          # UP, LEFT
          @current_stage = @game.prev_stage()
          @update_stage_label()
        when 39, 40
          # RIGHT, DOWN
          @current_stage = @game.next_stage()
          @update_stage_label()
        when 13
          # ENTER
          @game.switch_scene('game')
      false

  disable_stage_control: () ->
    $(document).unbind "keydown"

  init_stage_nodes: () ->
    # bg
    @layer.add(new Kinetic.Rect({
      x: 0,
      y: 0,
      fill: "#999",
      width: 600,
      height: 520
    }))
    # label text
    @stage_label = new Kinetic.Text({
      x: 250,
      y: 230,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "STAGE #{@current_stage}",
      fill: "#333",
    })
    @layer.add(@stage_label)

  update_stage_label: () ->
    @stage_label.setText("STAGE #{@current_stage}")
    @layer.draw()

class ReportScene extends Scene
  constructor: (@game) ->
    super(@game)
    @p1_number_labels = {}
    @p2_number_labels = {}
    @init_scene()

  start: () ->
    super()
    @update_numbers()
    setTimeout(() =>
      if @game.get_config('game_over')
        @game.switch_scene('welcome')
      else
        @game.set_config('stage_autostart', true)
        @game.switch_scene('stage')
    , 5000)

  stop: () ->
    super()

  update_numbers: () ->
    @p2_group.show() if @game.get_config('players') == 1
    p1_kills = @game.get_config('p1_killed_enemies')
    p1_numbers = {
      stupid: 0, stupid_pts: 0,
      fish: 0, fish_pts: 0,
      fool: 0, fool_pts: 0,
      strong: 0, strong_pts: 0,
      total: 0, total_pts: 0
    }
    p2_numbers = _.cloneDeep(p1_numbers)
    _.each(p1_kills, (type) =>
      p1_numbers[type] += 1
      p1_numbers["#{type}_pts"] += @game.get_config("score_for_#{type}")
      p1_numbers['total'] += 1
      p1_numbers['total_pts'] += @game.get_config("score_for_#{type}")
    )
    p2_kills = @game.get_config('p2_killed_enemies')

    _.each(p2_kills, (type) ->
      p2_numbers[type] += 1
      p2_numbers["#{type}_pts"] += @game.get_config("score_for_#{type}")
      p2_numbers['total'] += 1
      p2_numbers['total_pts'] += @game.get_config("score_for_#{type}")
    )
    for tank, number of p1_numbers
      @p1_number_labels[tank].setText(number) unless tank == 'total_pts'
    for tank, number of p2_numbers
      @p2_number_labels[tank].setText(number) unless tank == 'total_pts'
    p1_final_score = @game.get_config('p1_score') + p1_numbers.total_pts
    p2_final_score = @game.get_config('p2_score') + p2_numbers.total_pts
    @game.set_config('p1_score', p1_final_score)
    @game.set_config('p2_score', p2_final_score)
    @p1_score_label.setText(p1_final_score)
    @p2_score_label.setText(p2_final_score)
    @game.set_config('hi_score', _.max([
      p1_final_score, p2_final_score, @game.get_config('hi_score')]))

    @stage_label.setText("STAGE #{@game.get_config('current_stage')}")
    @layer.draw()

  init_scene: () ->
    # Hi score texts
    @layer.add(new Kinetic.Text({
      x: 200,
      y: 40,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "HI-SCORE",
      fill: "#DB2B00"
    }))

    # Hi score
    @hi_score_label = new Kinetic.Text({
      x: 328,
      y: 40,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "#{@game.get_config('hi_score')}",
      fill: "#FF9B3B"
    })
    @layer.add(@hi_score_label)
    # stage text
    @stage_label = new Kinetic.Text({
      x: 250,
      y: 80,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "STAGE #{@game.get_config('current_stage')}",
      fill: "#fff"
    })
    @layer.add(@stage_label)

    # center tanks
    image = document.getElementById('tank_sprite')
    tank_sprite = new Kinetic.Sprite({
      x: 300,
      y: 220,
      image: image,
      animation: 'stupid_hp1',
      animations: Animations.movables,
      frameRate: Animations.rate('stupid_hp1'),
      index: 0,
      offset: {x: 20, y: 20},
      rotationDeg: 0
    })
    @layer.add(tank_sprite)
    @layer.add(tank_sprite.clone({y: 280, animation: 'fish_hp1'}))
    @layer.add(tank_sprite.clone({y: 340, animation: 'fool_hp1'}))
    @layer.add(tank_sprite.clone({y: 400, animation: 'strong_hp1'}))
    # center underline
    @layer.add(new Kinetic.Rect({
      x: 235,
      y: 423,
      width: 130,
      height: 4,
      fill: "#fff"
    }))

    @p1_group = new Kinetic.Group()
    @layer.add(@p1_group)

    # p1 score
    @p1_score_label = new Kinetic.Text({
      x: 95,
      y: 160,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "0",
      fill: "#FF9B3B",
      align: "right",
      width: 120
    })
    @p1_group.add(@p1_score_label)
    # p1 text
    @p1_group.add(@p1_score_label.clone({
      text: "I-PLAYER",
      fill: "#DB2B00",
      y: 120
    }))

    # p1 pts * 4
    p1_pts = @p1_score_label.clone({
      x: 175,
      y: 210,
      text: "PTS",
      width: 40,
      fill: "#fff"
    })
    @p1_group.add(p1_pts)
    @p1_group.add(p1_pts.clone({y: 270}))
    @p1_group.add(p1_pts.clone({y: 330}))
    @p1_group.add(p1_pts.clone({y: 390}))
    # p1 total text
    @p1_group.add(p1_pts.clone({x: 145, y: 430, text: "TOTAL", width: 70}))
    # p1 arrows * 4
    p1_arrow = new Kinetic.Path({
      x: 260,
      y: 210,
      width: 16,
      height: 20,
      data: 'M8,0 l-8,10 l8,10 l0,-6 l8,0 l0,-8 l-8,0 l0,-6 z',
      fill: '#fff'
    })
    @p1_group.add(p1_arrow)
    @p1_group.add(p1_arrow.clone({y: 270}))
    @p1_group.add(p1_arrow.clone({y: 330}))
    @p1_group.add(p1_arrow.clone({y: 390}))

    p1_number = @p1_score_label.clone({
      fill: '#fff',
      x: 226,
      y: 210,
      width: 30,
      text: '75'
    })
    p1_number_pts = p1_number.clone({x:105, width: 60, text: '3800'})
    @p1_number_labels['stupid'] = p1_number
    @p1_number_labels['stupid_pts'] = p1_number_pts
    @p1_group.add(@p1_number_labels['stupid'])
    @p1_group.add(@p1_number_labels['stupid_pts'])
    @p1_number_labels['fish'] = p1_number.clone({y: 270})
    @p1_number_labels['fish_pts'] = p1_number_pts.clone({y: 270})
    @p1_group.add(@p1_number_labels['fish'])
    @p1_group.add(@p1_number_labels['fish_pts'])
    @p1_number_labels['fool'] = p1_number.clone({y: 330})
    @p1_number_labels['fool_pts'] = p1_number_pts.clone({y: 330})
    @p1_group.add(@p1_number_labels['fool'])
    @p1_group.add(@p1_number_labels['fool_pts'])
    @p1_number_labels['strong'] = p1_number.clone({y: 390})
    @p1_number_labels['strong_pts'] = p1_number_pts.clone({y: 390})
    @p1_group.add(@p1_number_labels['strong'])
    @p1_group.add(@p1_number_labels['strong_pts'])
    @p1_number_labels['total'] = p1_number.clone({y: 430})
    @p1_group.add(@p1_number_labels['total'])

    @p2_group = new Kinetic.Group()
    @layer.add(@p2_group)

    # p2 score
    @p2_score_label = new Kinetic.Text({
      x: 385,
      y: 160,
      fontSize: 22,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "0",
      fill: "#FF9B3B"
    })
    @p2_group.add(@p2_score_label)
    # p2 text
    @p2_group.add(@p2_score_label.clone({
      text: "II-PLAYER",
      fill: "#DB2B00",
      y: 120
    }))
    # p2 arrow * 4
    p2_pts = @p2_score_label.clone({
      y: 210,
      text: "PTS",
      width: 40,
      fill: "#fff"
    })
    @p2_group.add(p2_pts)
    @p2_group.add(p2_pts.clone({y: 270}))
    @p2_group.add(p2_pts.clone({y: 330}))
    @p2_group.add(p2_pts.clone({y: 390}))
    # p2 total text
    @p2_group.add(p2_pts.clone({y: 430, text: "TOTAL", width: 70}))
    # p2 arrow * 4
    p2_arrow = new Kinetic.Path({
      x: 324,
      y: 210,
      width: 16,
      height: 20,
      data: 'M8,0 l8,10 l-8,10 l0,-6 l-8,0 l0,-8 l8,0 l0,-6 z',
      fill: '#fff'
    })
    @p2_group.add(p2_arrow)
    @p2_group.add(p2_arrow.clone({y: 270}))
    @p2_group.add(p2_arrow.clone({y: 330}))
    @p2_group.add(p2_arrow.clone({y: 390}))
    # p2 numbers
    p2_number = @p2_score_label.clone({
      fill: '#fff',
      x: 344,
      y: 210,
      width: 30,
      text: '75'
    })
    p2_number_pts = p2_number.clone({x:435, width: 60, text: '3800'})
    @p2_number_labels['stupid'] = p2_number
    @p2_number_labels['stupid_pts'] = p2_number_pts
    @p2_group.add(@p2_number_labels['stupid'])
    @p2_group.add(@p2_number_labels['stupid_pts'])
    @p2_number_labels['fish'] = p2_number.clone({y: 270})
    @p2_number_labels['fish_pts'] = p2_number_pts.clone({y: 270})
    @p2_group.add(@p2_number_labels['fish'])
    @p2_group.add(@p2_number_labels['fish_pts'])
    @p2_number_labels['fool'] = p2_number.clone({y: 330})
    @p2_number_labels['fool_pts'] = p2_number_pts.clone({y: 330})
    @p2_group.add(@p2_number_labels['fool'])
    @p2_group.add(@p2_number_labels['fool_pts'])
    @p2_number_labels['strong'] = p2_number.clone({y: 390})
    @p2_number_labels['strong_pts'] = p2_number_pts.clone({y: 390})
    @p2_group.add(@p2_number_labels['strong'])
    @p2_group.add(@p2_number_labels['strong_pts'])
    @p2_number_labels['total'] = p2_number.clone({y: 430})
    @p2_group.add(@p2_number_labels['total'])

    @p2_group.hide()

class HiScoreScene extends Scene
  constructor: (@game) ->
    super(@game)

  start: () ->
    super()
    # add

class GameScene extends Scene
  constructor: (@game) ->
    super(@game)
    @map = new Map2D(@layer)
    $.ajax {
      url: "data/terrains.json",
      success: (json) => @builder = new TiledMapBuilder(@map, json)
      dataType: 'json',
      async: false
    }
    @reset_config_variables()
    @init_status()
    @bgms = [
      new Howl({urls: ['data/s1.ogg', 'data/s1.mp3'], loop: true}),
      new Howl({urls: ['data/s2.ogg', 'data/s2.mp3'], loop: true}),
      new Howl({urls: ['data/s3.ogg', 'data/s3.mp3'], loop: true}),
      new Howl({urls: ['data/s2.ogg', 'data/s2.mp3'], loop: true}),
      new Howl({urls: ['data/s5.ogg', 'data/s5.mp3'], loop: true}),
      new Howl({urls: ['data/s6.ogg', 'data/s6.mp3'], loop: true}),
      new Howl({urls: ['data/s7.ogg', 'data/s7.mp3'], loop: true}),
      new Howl({urls: ['data/win.ogg', 'data/win.mp3'], loop: true})
    ]
    window.gs = this # for debug

  current_bgm: () ->
    @bgms[(@current_stage - 1) % 8]

  reset_config_variables: () ->
    @fps = 0
    @remain_enemy_counts = 0
    @remain_user_p1_lives = 0
    @remain_user_p2_lives = 0
    @current_stage = 0
    @last_enemy_born_area_index = 0

  load_config_variables: () ->
    @fps = @game.get_config('fps')
    @remain_enemy_counts = @game.get_config('enemies_per_stage')
    @remain_user_p1_lives = @game.get_config('p1_lives')
    if @game.get_config('players') == 2
      @remain_user_p2_lives = @game.get_config('p2_lives')
    else
      @remain_user_p2_lives = 0
    @current_stage = @game.get_config('current_stage')
    @last_enemy_born_area_index = 0
    @winner = null

  start: () ->
    super()
    @load_config_variables()
    @start_map()
    @enable_user_control()
    @enable_system_control()
    @start_time_line()
    @running = true
    @p1_user_initialized = false
    @p2_user_initialized = false
    @current_bgm().play()

  stop: () ->
    super()
    @update_status()
    @disable_controls()
    @stop_time_line()
    @save_user_status() if @winner == 'user'
    @map.reset()
    @current_bgm().stop()

  save_user_status: () ->
    @game.set_config('p1_lives', @remain_user_p1_lives + 1)
    @game.set_config('p2_lives', @remain_user_p2_lives + 1)
    if @map.p1_tank() != undefined
      @game.set_config('p1_level', @map.p1_tank().level)
      @game.set_config('p1_ship', @map.p1_tank().ship)
    if @map.p2_tank() != undefined
      @game.set_config('p2_level', @map.p2_tank().level)
      @game.set_config('p2_ship', @map.p2_tank().ship)

  start_map: () ->
    # wait until builder loaded
    @map.bind('map_ready', @born_p1_tank, this)
    @map.bind('map_ready', @born_p2_tank, this)
    @map.bind('map_ready', @born_enemy_tank, this)
    @map.bind('map_ready', @born_enemy_tank, this)
    @map.bind('map_ready', @born_enemy_tank, this)
    @map.bind('tank_destroyed', @born_tanks, this)
    @map.bind('tank_destroyed', @draw_tank_points, this)
    @map.bind('gift_consumed', @draw_gift_points, this)
    @map.bind('home_destroyed', @check_enemy_win, this)
    @map.bind('tank_life_up', @add_extra_life, this)
    @builder.setup_stage(@current_stage)
    @map.trigger('map_ready')

  enable_user_control: () ->
    $(document).bind "keyup", (event) =>
      if @map.p1_tank()
        @map.p1_tank().commander.add_key_event("keyup", event.which)
      if @map.p2_tank()
        @map.p2_tank().commander.add_key_event("keyup", event.which)
      false

    $(document).bind "keydown", (event) =>
      if @map.p1_tank()
        @map.p1_tank().commander.add_key_event("keydown", event.which)
      if @map.p2_tank()
        @map.p2_tank().commander.add_key_event("keydown", event.which)
      false

  enable_system_control: () ->
    $(document).bind "keydown", (event) =>
      switch event.which
        when 13
          # ENTER
          if @running then @pause() else @rescue()
        when 27
          # ESC
          @game.reset()

  disable_controls: () ->
    if @map.p1_tank()
      @map.p1_tank().commander.reset()
    if @map.p2_tank()
      @map.p2_tank().commander.reset()
    $(document).unbind "keyup"
    $(document).unbind "keydown"

  pause: () ->
    @running = false
    @stop_time_line()
    @disable_user_controls()
    @current_bgm().pause()

  disable_user_controls: () ->
    @disable_controls()
    @enable_system_control()

  rescue: () ->
    @running = true
    @start_time_line()
    @enable_user_control()
    @current_bgm().play()

  start_time_line: () ->
    last_time = new Date()
    @timeline = setInterval(() =>
      current_time = new Date()
      delta_time = current_time.getMilliseconds() - last_time.getMilliseconds()
      # assume a frame will never last more than 1 second
      delta_time += 1000 if delta_time < 0
      unit.integration(delta_time) for unit in @map.missiles
      unit.integration(delta_time) for unit in @map.gifts
      unit.integration(delta_time) for unit in @map.tanks
      unit.integration(delta_time) for unit in @map.missiles
      last_time = current_time
      @frame_rate += 1
    , parseInt(1000/@fps))
    # show frame rate
    @frame_timeline = setInterval(() =>
      @frame_rate_label.setText(@frame_rate + " fps")
      @frame_rate = 0
    , 1000)

  stop_time_line: () ->
    clearInterval(@timeline)
    clearInterval(@frame_timeline)

  init_status: () ->
    @status_panel = new Kinetic.Group()
    @layer.add(@status_panel)

    # background
    @status_panel.add(new Kinetic.Rect({
      x: 520,
      y: 0,
      fill: "#999",
      width: 80,
      height: 520
    }))

    # frame rate
    @frame_rate = 0
    @frame_rate_label = new Kinetic.Text({
      x: 526,
      y: 490,
      fontSize: 20,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "0 fps"
      fill: "#c00"
    })
    @status_panel.add(@frame_rate_label)

    @enemy_symbols = []
    # enemy tanks
    for i in [1..@remain_enemy_counts]
      tx = (if i % 2 == 1 then 540 else 560)
      ty = parseInt((i - 1) / 2) * 25 + 20
      symbol = @new_symbol(@status_panel, 'enemy', tx, ty)
      @enemy_symbols.push(symbol)

    # user tank status
    user_p1_label = new Kinetic.Text({
      x: 540,
      y: 300,
      fontSize: 18,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "1P",
      fill: "#000"
    })
    user_p1_symbol = @new_symbol(@status_panel, 'user', 540, 320)
    @user_p1_remain_lives_label = new Kinetic.Text({
      x: 565,
      y: 324,
      fontSize: 16,
      fontFamily: "Courier",
      text: "#{@remain_user_p1_lives}",
      fill: "#000"
    })
    @status_panel.add(user_p1_label)
    @status_panel.add(@user_p1_remain_lives_label)

    user_p2_label = new Kinetic.Text({
      x: 540,
      y: 350,
      fontSize: 18,
      fontStyle: "bold",
      fontFamily: "Courier",
      text: "2P",
      fill: "#000"
    })
    user_p2_symbol = @new_symbol(@status_panel, 'user', 540, 370)
    @user_p2_remain_lives_label = new Kinetic.Text({
      x: 565,
      y: 374,
      fontSize: 16,
      fontFamily: "Courier",
      text: "#{@remain_user_p2_lives}",
      fill: "#000"
    })
    @status_panel.add(user_p2_label)
    @status_panel.add(@user_p2_remain_lives_label)

    # stage status
    @new_symbol(@status_panel, 'stage', 540, 420)
    @stage_label = new Kinetic.Text({
      x: 560,
      y: 445,
      fontSize: 16,
      fontFamily: "Courier",
      text: "#{@current_stage}",
      fill: "#000"
    })
    @status_panel.add(@stage_label)

  update_status: () ->
    _.each(@enemy_symbols, (symbol) -> symbol.destroy())
    @enemy_symbols = []
    if @remain_enemy_counts > 0
      for i in [1..@remain_enemy_counts]
        tx = (if i % 2 == 1 then 540 else 560)
        ty = parseInt((i - 1) / 2) * 25 + 20
        symbol = @new_symbol(@status_panel, 'enemy', tx, ty)
        @enemy_symbols.push(symbol)
    @user_p1_remain_lives_label.setText(@remain_user_p1_lives)
    @user_p2_remain_lives_label.setText(@remain_user_p2_lives)
    @stage_label.setText(@current_stage)

  new_symbol: (parent, type, tx, ty) ->
    animations = switch type
      when 'enemy'
        [{x: 320, y: 340, width: 20, height: 20}]
      when 'user'
        [{x: 340, y: 340, width: 20, height: 20}]
      when 'stage'
        [{x: 280, y: 340, width: 40, height: 40}]
    symbol = new Kinetic.Sprite({
      x: tx,
      y: ty,
      image: @map.image,
      animation: 'static',
      animations: {
        'static': animations
      },
      frameRate: 1,
      index: 0
    })
    parent.add(symbol)
    symbol.start()
    symbol

  add_extra_life: (tank) ->
    if tank instanceof UserP1Tank
      @remain_user_p1_lives += 1
    else
      @remain_user_p2_lives += 1
    @update_status()

  born_p1_tank: () ->
    if @remain_user_p1_lives > 0
      @remain_user_p1_lives -= 1
      @map.add_tank(UserP1Tank, new MapArea2D(160, 480, 200, 520))
      unless @p1_user_initialized
        inherited_level = @game.get_config('p1_level')
        @map.p1_tank().level_up(inherited_level - 1)
        @p1_user_initialized = true
      @update_status()
    else
      @check_enemy_win()

  born_p2_tank: () ->
    if @remain_user_p2_lives > 0
      @remain_user_p2_lives -= 1
      @map.add_tank(UserP2Tank, new MapArea2D(320, 480, 360, 520))
      unless @p2_user_initialized
        inherited_level = @game.get_config('p2_level')
        @map.p2_tank().level_up(inherited_level - 1)
        @p2_user_initialized = true
      @update_status()
    else
      @check_enemy_win()

  born_enemy_tank: () ->
    if @remain_enemy_counts > 0
      @remain_enemy_counts -= 1
      enemy_born_areas = [
        new MapArea2D(0, 0, 40, 40),
        new MapArea2D(240, 0, 280, 40),
        new MapArea2D(480, 0, 520, 40)
      ]
      enemy_tank_types = [StupidTank, FishTank, FoolTank, StrongTank]
      randomed = parseInt(Math.random() * 1000) % _.size(enemy_tank_types)
      @map.add_tank(enemy_tank_types[randomed],
        enemy_born_areas[@last_enemy_born_area_index])
      @last_enemy_born_area_index = (@last_enemy_born_area_index + 1) % 3
      @update_status()
    else
      @check_user_win()

  check_user_win: () ->
    if @remain_enemy_counts == 0 and _.size(@map.enemy_tanks()) == 0
      @user_win()

  check_enemy_win: () ->
    @enemy_win() if @map.home().destroyed
    @enemy_win() if (@remain_user_p1_lives == 0 and @remain_user_p2_lives == 0)

  user_win: () ->
    return unless _.isNull(@winner)
    @winner = 'user'
    # report
    setTimeout((() =>
      @game.next_stage()
      @game.switch_scene('report')
    ), 5000)

  enemy_win: () ->
    return unless _.isNull(@winner)
    @winner = 'enemy'
    # hi score or
    @disable_user_controls()
    # welcome
    setTimeout(() =>
      @game.set_config('game_over', true)
      @game.switch_scene('report')
    , 5000)

  born_tanks: (tank, killed_by_tank) ->
    if tank instanceof UserP1Tank
      @born_p1_tank()
    else if tank instanceof UserP2Tank
      @born_p2_tank()
    else
      if killed_by_tank instanceof UserP1Tank
        p1_kills = @game.get_config('p1_killed_enemies')
        p1_kills.push(tank.type())
      else if killed_by_tank instanceof UserP2Tank
        p2_kills = @game.get_config('p2_killed_enemies')
        p2_kills.push(tank.type())
      @born_enemy_tank()

  draw_tank_points: (tank, killed_by_tank) ->
    if tank instanceof EnemyTank
      point_label = new Kinetic.Text({
        x: (tank.area.x1 + tank.area.x2) / 2 - 10,
        y: (tank.area.y1 + tank.area.y2) / 2 - 5,
        fontSize: 16,
        fontStyle: "bold",
        fontFamily: "Courier",
        text: @game.get_config("score_for_#{tank.type()}")
        fill: "#fff"
      })
      @status_panel.add(point_label)
      setTimeout(() ->
        point_label.destroy()
      , 2000)

  draw_gift_points: (gift, tanks) ->
    _.detect(tanks, (tank) =>
      if tank instanceof UserTank
        point_label = new Kinetic.Text({
          x: (gift.area.x1 + gift.area.x2) / 2 - 10,
          y: (gift.area.y1 + gift.area.y2) / 2 - 5,
          fontSize: 16,
          fontStyle: "bold",
          fontFamily: "Courier",
          text: @game.get_config("score_for_gift"),
          fill: "#fff"
        })
        @status_panel.add(point_label)
        setTimeout(() ->
          point_label.destroy()
        , 2000)
        true
      else
        false
    )

class TiledMapBuilder
  constructor: (@map, @json) ->
    @tile_width = parseInt(@json.tilewidth)
    @tile_height = parseInt(@json.tileheight)
    @map_width = parseInt(@json.width)
    @map_height = parseInt(@json.height)
    @tile_properties = {}
    _.each @json.tilesets, (tileset) =>
      for gid, props of tileset.tileproperties
        @tile_properties[tileset.firstgid + parseInt(gid)] = props
  setup_stage: (stage) ->
    home_layer = _.detect(@json.layers, (layer) -> layer.name is "Home")
    stage_layer = _.detect(@json.layers, (layer) ->
      layer.name is "Stage #{stage}"
    )
    _.each [home_layer, stage_layer], (layer) =>
      h = 0
      while h < @map_height
        w = 0
        while w < @map_width
          tile_id = layer.data[h * @map_width + w]
          if tile_id != 0
            properties = @tile_properties[tile_id]
            [x1, y1] = [
              w * @tile_width + parseInt(properties.x_offset),
              h * @tile_height + parseInt(properties.y_offset)
            ]
            area = new MapArea2D(x1, y1,
              x1 + parseInt(properties.width),
              y1 + parseInt(properties.height)
            )
            @map.add_terrain(eval(properties.type), area)
          w += 1
        h += 1

class OnlineGamesScene extends Scene
  constructor: (@game) ->
    super(@game)
    @static_group = new Kinetic.Group()
    @layer.add(@static_group)
    @init_statics()
    #@init_user_selection()

  start: () ->
    super()
    @enable_selection_control()
    @update_game_list()

  stop: () ->
    super()
    @disable_selection_control()
    @prepare_for_game_scene()

  prepare_for_game_scene: () ->
    @game.set_config('game_over', false)
    @game.set_config('stage_autostart', false)
    @game.set_config('current_stage', 1)
    @game.set_config('p1_score', 0)
    @game.set_config('p2_score', 0)
    @game.set_config('p1_lives', 2)
    @game.set_config('p2_lives', 2)
    @game.set_config('p1_level', 1)
    @game.set_config('p2_level', 1)

  enable_selection_control: () ->
    $(document).bind "keydown", (event) =>
      switch event.which
        when 13
          # ENTER
          @game.switch_scene('stage')
        when 32
          # SPACE
          @toggle_game()

  disable_selection_control: () ->
    $(document).unbind "keydown"

  toggle_game: () ->
    curr_position = (@game.get_config('curr_menu_game') + 1) %
      @game.get_config('online_games').length
    @game.set_config('curr_menu_game', curr_position )
    @update_game_list()

  update_game_list: () ->
    console.log(@game.get_config('curr_menu_game'))

    for gm, i in @game_labels
      if @game.get_config('curr_menu_game') == i
        gm.setFontStyle('bold')
      else
        gm.setFontStyle('normal')
    @layer.draw()

  init_statics: () ->
    @game_labels = []

    for game, i in @game.get_config('online_games')
      online_game = new Kinetic.Text
        x: 40
        y: 40 + 20 * i
        fontSize: 22
        fontStyle: "normal"
        fontFamily: "Courier"
        text: game
        fill: "#fff"

      @game_labels.push(online_game)
      @static_group.add(online_game)


#class Scene
#  constructor: (@game) ->
#    @layer = new Kinetic.Layer()
#    @game.canvas.add(@layer)
#    @layer.hide()
#
#  start: () ->
#    @layer.show()
#    @layer.draw()
#  stop: () -> @layer.hide()

class Point
  constructor: (@x, @y) ->

class MapArea2D
  constructor: (@x1, @y1, @x2, @y2) ->
  intersect: (area) ->
    new MapArea2D(_.max([area.x1, @x1]), _.max([area.y1, @y1]),
      _.min([area.x2, @x2]), _.min([area.y2, @y2]))
  sub: (area) ->
    intersection = @intersect(area)
    _.select([
      new MapArea2D(@x1, @y1, @x2, intersection.y1),
      new MapArea2D(@x1, intersection.y2, @x2, @y2),
      new MapArea2D(@x1, intersection.y1, intersection.x1, intersection.y2),
      new MapArea2D(intersection.x2, intersection.y1, @x2, intersection.y2)
    ], (candidate_area) -> candidate_area.valid())
  collide: (area) ->
    not (@x2 <= area.x1 or @y2 <= area.y1 or @x1 >= area.x2 or @y1 >= area.y2)
  extend: (direction, ratio) ->
    switch direction
      when Direction.UP
        new MapArea2D(@x1, @y1 - ratio * @height(), @x2, @y2)
      when Direction.RIGHT
        new MapArea2D(@x1, @y1, @x2 + ratio * @width(), @y2)
      when Direction.DOWN
        new MapArea2D(@x1, @y1, @x2, @y2 + ratio * @height())
      when Direction.LEFT
        new MapArea2D(@x1 - ratio * @width(), @y1, @x2, @y2)
  equals: (area) ->
    return false unless area instanceof MapArea2D
    area.x1 == @x1 and area.x2 == @x2 and area.y1 == @y1 and area.y2 == @y2
  valid: () -> @x2 > @x1 and @y2 > @y1
  center: () -> new Point((@x1 + @x2)/2, (@y1 + @y2)/2)
  clone: () -> new MapArea2D(@x1, @y1, @x2, @y2)
  width: () -> @x2 - @x1
  height: () -> @y2 - @y1
  to_s: () -> "[" + @x1 + ", " + @y1 + ", " + @x2 + ", " + @y2 + "]"

class MapArea2DVertex extends MapArea2D
  constructor: (@x1, @y1, @x2, @y2) -> @siblings = []
  init_vxy: (@vx, @vy) ->
  add_sibling: (sibling) -> @siblings.push(sibling)
  a_star_weight: (target_vertex) ->
    (Math.pow(@vx - target_vertex.vx, 2) +
      Math.pow(@vy - target_vertex.vy, 2)) / 2

class Map2D
  max_x: 520
  max_y: 520
  default_width: 40
  default_height: 40
  infinity: 65535

  map_units: [] # has_many map_units
  terrains: [] # has_many terrains
  tanks: [] # has_many tanks
  missiles: [] # has_many missiles
  gifts: [] # has_many gifts

  constructor: (@canvas) ->
    @groups = {
      gift: new Kinetic.Group(),
      front: new Kinetic.Group(),
      middle: new Kinetic.Group(),
      back: new Kinetic.Group()
    }
    @canvas.add(@groups['back'])
    @canvas.add(@groups['middle'])
    @canvas.add(@groups['front'])
    @canvas.add(@groups['gift'])

    @image = document.getElementById("tank_sprite")

    @vertexes_columns = 4 * @max_x / @default_width - 3
    @vertexes_rows = 4 * @max_y / @default_height - 3
    @vertexes = @init_vertexes()
    @home_vertex = @vertexes[24][48]

    @bindings = {}

  reset: () ->
    @bindings = {}
    _.each(@map_units, (unit) -> unit.destroy())

  add_terrain: (terrain_cls, area) ->
    terrain = new terrain_cls(this, area)
    @terrains.push(terrain)
    @map_units.push(terrain)
    terrain

  add_tank: (tank_cls, area) ->
    tank = new tank_cls(this, area)
    @tanks.push(tank)
    @map_units.push(tank)
    tank

  add_missile: (parent) ->
    missile = new Missile(this, parent)
    @missiles.push(missile)
    @map_units.push(missile)
    missile

  random_gift: () ->
    _.each(@gifts, (gift) -> gift.destroy())

    gift_classes = [GunGift, HatGift, ShipGift, StarGift,
      LifeGift, ClockGift, ShovelGift, LandMineGift]
    vx = parseInt(Math.random() * @vertexes_rows)
    vy = parseInt(Math.random() * @vertexes_columns)
    gift_choice = parseInt(Math.random() * 1000) % _.size(gift_classes)
    gift = new gift_classes[gift_choice](this, @vertexes[vx][vy].clone())
    @gifts.push(gift)
    @map_units.push(gift)
    gift

  delete_map_unit: (map_unit) ->
    if map_unit instanceof Terrain
      @terrains = _.without(@terrains, map_unit)
    else if map_unit instanceof Missile
      @missiles = _.without(@missiles, map_unit)
    else if map_unit instanceof Tank
      @tanks = _.without(@tanks, map_unit)
    else if map_unit instanceof Gift
      @gifts = _.without(@gifts, map_unit)
    @map_units = _.without(@map_units, map_unit)

  p1_tank: -> _.first(_.select(@tanks, (tank) -> tank.type() == "user_p1"))
  p2_tank: -> _.first(_.select(@tanks, (tank) -> tank.type() == "user_p2"))
  home: -> _.first(_.select(@terrains, (terrain) -> terrain.type() == "home"))
  user_tanks: -> _.select(@tanks, (tank) -> tank instanceof UserTank)
  enemy_tanks: -> _.select(@tanks, (tank) -> tank instanceof EnemyTank)

  units_at: (area) ->
    _.select(@map_units, (map_unit) ->
      map_unit.area.collide(area)
    )
  out_of_bound: (area) ->
    area.x1 < 0 or area.x2 > @max_x or area.y1 < 0 or area.y2 > @max_y
  area_available: (unit, area) ->
    _.all(@map_units, (map_unit) ->
      (map_unit is unit) or
        map_unit.accept(unit) or
        not map_unit.area.collide(area)
    )

  init_vertexes: () ->
    vertexes = []
    [x1, x2] = [0, @default_width]
    while x2 <= @max_x
      column_vertexes = []
      [y1, y2] = [0, @default_height]
      while y2 <= @max_y
        column_vertexes.push(new MapArea2DVertex(x1, y1, x2, y2))
        [y1, y2] = [y1 + @default_height/4, y2 + @default_height/4]
      vertexes.push(column_vertexes)
      [x1, x2] = [x1 + @default_width/4, x2 + @default_width/4]
    for x in _.range(0, @vertexes_columns)
      for y in _.range(0, @vertexes_rows)
        for sib in [
          {x: x, y: y - 1},
          {x: x + 1, y: y},
          {x: x, y: y + 1},
          {x: x - 1, y: y}
        ]
          vertexes[x][y].init_vxy(x, y)
          if 0 <= sib.x < @vertexes_columns and 0 <= sib.y < @vertexes_rows
            vertexes[x][y].add_sibling(vertexes[sib.x][sib.y])
    vertexes

  # area must be the same with a map vertexe
  vertexes_at: (area) ->
    vx = parseInt(area.x1 * 4 / @default_width)
    vy = parseInt(area.y1 * 4 / @default_height)
    @vertexes[vx][vy]

  random_vertex: () ->
    vx = parseInt(Math.random() * @vertexes_rows)
    vx = (vx - 1) if vx % 2 == 1
    vy = parseInt(Math.random() * @vertexes_columns)
    vy = (vy - 1) if vy % 2 == 1
    @vertexes[vx][vy]

  weight: (tank, from, to) ->
    sub_area = _.first(to.sub(from))
    terrain_units = _.select(@units_at(sub_area), (unit) ->
      unit instanceof Terrain
    )
    return 1 if _.isEmpty(terrain_units)
    max_weight = _.max(_.map(terrain_units, (terrain_unit) ->
      terrain_unit.weight(tank)
    ))
    max_weight / (@default_width * @default_height) *
      sub_area.width() * sub_area.height()

  shortest_path: (tank, start_vertex, end_vertex) ->
    [d, pi] = @intialize_single_source(end_vertex)
    d[start_vertex.vx][start_vertex.vy].key = 0
    heap = new BinomialHeap()
    for x in _.range(0, @vertexes_columns)
      for y in _.range(0, @vertexes_rows)
        heap.insert(d[x][y])
    until heap.is_empty()
      u = heap.extract_min().satellite
      for v in u.siblings
        @relax(heap, d, pi, u, v, @weight(tank, u, v), end_vertex)
      break if u is end_vertex
    @calculate_shortest_path_from_pi(pi, start_vertex, end_vertex)

  intialize_single_source: (target_vertex) ->
    d = []
    pi = []
    for x in _.range(0, @vertexes_columns)
      column_ds = []
      column_pi = []
      for y in _.range(0, @vertexes_rows)
        node = new BinomialHeapNode(@vertexes[x][y],
          @infinity - @vertexes[x][y].a_star_weight(target_vertex))
        column_ds.push(node)
        column_pi.push(null)
      d.push(column_ds)
      pi.push(column_pi)
    [d, pi]

  relax: (heap, d, pi, u, v, w, target_vertex) ->
    # an area like [30, 50, 70, 90] is not movable, so do not relax here
    return if v.vx % 2 == 1 and u.vx % 2 == 1
    return if v.vy % 2 == 1 and u.vy % 2 == 1
    aw = v.a_star_weight(target_vertex) - u.a_star_weight(target_vertex)
    if d[v.vx][v.vy].key > d[u.vx][u.vy].key + w + aw
      heap.decrease_key(d[v.vx][v.vy], d[u.vx][u.vy].key + w + aw)
      pi[v.vx][v.vy] = u

  calculate_shortest_path_from_pi: (pi, start_vertex, end_vertex) ->
    reverse_paths = []
    v = end_vertex
    until pi[v.vx][v.vy] is null
      reverse_paths.push(v)
      v = pi[v.vx][v.vy]
    reverse_paths.push(start_vertex)
    reverse_paths.reverse()

  bind: (event, callback, scope=this) ->
    @bindings[event] = [] if _.isEmpty(@bindings[event])
    @bindings[event].push({'scope': scope, 'callback': callback})

  trigger: (event, params...) ->
    return if _.isEmpty(@bindings[event])
    for handler in @bindings[event]
      handler.callback.apply(handler.scope, params)

class MapUnit2D
  group: 'middle'
  max_defend_point: 9

  constructor: (@map, @area) ->
    @default_width = @map.default_width
    @default_height = @map.default_height
    @bom_on_destroy = false
    @destroyed = false
    @new_display() # should be overwrite
    @after_new_display()
    @attached_timeout_handlers = []

  after_new_display: () ->
    @map.groups[@group].add(@display_object)
    @display_object.start()

  destroy_display: () ->
    if @bom_on_destroy
      @display_object.setOffset(20, 20)
      @display_object.setAnimations(Animations.movables)
      @display_object.setAnimation('bom')
      @display_object.setFrameRate(Animations.rate('bom'))
      @display_object.start()
      @display_object.afterFrame 3, () =>
        @display_object.stop()
        @display_object.destroy()
    else
      @display_object.stop()
      @display_object.destroy()

  width: () -> @area.x2 - @area.x1
  height: () -> @area.y2 - @area.y1

  destroy: () ->
    unless @destroyed
      @destroyed = true
    @destroy_display()
    @detach_timeout_events()
    @map.delete_map_unit(this)

  defend: (missile, destroy_area) -> 0
  accept: (map_unit) -> true

  attach_timeout_event: (func, delay) ->
    handle = setTimeout(func, delay)
    @attached_timeout_handlers.push(handle)

  detach_timeout_events: () ->
    _.each(@attached_timeout_handlers, (handle) -> clearTimeout(handle))

class MovableMapUnit2D extends MapUnit2D
  speed: 0.08

  constructor: (@map, @area) ->
    @delayed_commands = []
    @moving = false
    @direction = 0
    @commander = new Commander(this)
    super(@map, @area)

  new_display: () ->
    center = @area.center()
    @display_object = new Kinetic.Sprite({
      x: center.x,
      y: center.y,
      image: @map.image,
      animation: @animation_state(),
      animations: Animations.movables,
      frameRate: Animations.rate(@animation_state()),
      index: 0,
      offset: {x: @area.width()/2, y: @area.height()/2},
      rotationDeg: @direction,
      map_unit: this
    })

  update_display: () ->
    return if @destroyed
    @display_object.setAnimation(@animation_state())
    @display_object.setFrameRate(Animations.rate(@animation_state()))
    @display_object.setRotationDeg(@direction)
    center = @area.center()
    @display_object.setAbsolutePosition(center.x, center.y)

  queued_delayed_commands: () ->
    [commands, @delayed_commands] = [@delayed_commands, []]
    commands
  add_delayed_command: (command) -> @delayed_commands.push(command)

  integration: (delta_time) ->
    return if @destroyed
    @commands = _.union(@commander.next_commands(), @queued_delayed_commands())
    @handle_turn(cmd) for cmd in @commands
    @handle_move(cmd, delta_time) for cmd in @commands

  handle_turn: (command) ->
    switch(command.type)
      when "direction"
        @turn(command.params.direction)

  handle_move: (command, delta_time) ->
    switch(command.type)
      when "start_move"
        @moving = true
        max_offset = parseInt(@speed * delta_time)
        intent_offset = command.params.offset
        if intent_offset is null
          @move(max_offset)
        else if intent_offset > 0
          real_offset = _.min([intent_offset, max_offset])
          if @move(real_offset)
            command.params.offset -= real_offset
            @add_delayed_command(command) if command.params.offset > 0
          else
            @add_delayed_command(command)
      when "stop_move"
        # do not move by default
        @moving = false

  turn: (direction) ->
    if _.contains([Direction.UP, Direction.DOWN], direction)
      @direction = direction if @_adjust_x()
    else
      @direction = direction if @_adjust_y()
    @update_display()

  _try_adjust: (area) ->
    if @map.area_available(this, area)
      @area = area
      true
    else
      false

  _adjust_x: () ->
    offset = (@default_height/4) -
      (@area.x1 + @default_height/4)%(@default_height/2)
    @_try_adjust(new MapArea2D(@area.x1 + offset, @area.y1,
      @area.x2 + offset, @area.y2))

  _adjust_y: () ->
    offset = (@default_width/4) -
      (@area.y1 + @default_width/4)%(@default_width/2)
    @_try_adjust(new MapArea2D(@area.x1, @area.y1 + offset,
      @area.x2, @area.y2 + offset))

  move: (offset) ->
    _.detect(_.range(1, offset + 1).reverse(), (os) => @_try_move(os))

  _try_move: (offset) ->
    [offset_x, offset_y] = @_offset_by_direction(offset)
    return false if offset_x == 0 and offset_y == 0
    target_x = @area.x1 + offset_x
    target_y = @area.y1 + offset_y
    target_area = new MapArea2D(target_x, target_y,
      target_x + @width(), target_y + @height())
    if @map.area_available(this, target_area)
      @area = target_area
      @update_display()
      true
    else
      false

  _offset_by_direction: (offset) ->
    offset = parseInt(offset)
    switch (@direction)
      when Direction.UP
        [0, - _.min([offset, @area.y1])]
      when Direction.RIGHT
        [_.min([offset, @map.max_x - @area.x2]), 0]
      when Direction.DOWN
        [0, _.min([offset, @map.max_y - @area.y2])]
      when Direction.LEFT
        [- _.min([offset, @area.x1]), 0]

class Terrain extends MapUnit2D
  accept: (map_unit) -> false
  new_display: () ->
    animations = _.cloneDeep(Animations.terrain(@type()))
    for animation in animations
      animation.x += (@area.x1 % 40)
      animation.y += (@area.y1 % 40)
      animation.width = @area.width()
      animation.height = @area.height()
    @display_object = new Kinetic.Sprite({
      x: @area.x1,
      y: @area.y1,
      image: @map.image,
      index: 0,
      animation: 'static',
      animations: {static: animations},
      map_unit: this
    })

class BrickTerrain extends Terrain
  type: -> "brick"
  weight: (tank) ->
    40 / tank.power
  defend: (missile, destroy_area) ->
    # cut self into pieces
    pieces = @area.sub(destroy_area)
    _.each(pieces, (piece) =>
      @map.add_terrain(BrickTerrain, piece)
    )
    @destroy()
    # return cost of destroy
    1

class IronTerrain extends Terrain
  type: -> "iron"
  weight: (tank) ->
    switch tank.power
      when 1
        @map.infinity
      when 2
        20
  defend: (missile, destroy_area) ->
    return @max_defend_point if missile.power < 2
    double_destroy_area = destroy_area.extend(missile.direction, 1)
    pieces = @area.sub(double_destroy_area)
    _.each(pieces, (piece) =>
      @map.add_terrain(IronTerrain, piece)
    )
    @destroy()
    2

class WaterTerrain extends Terrain
  accept: (map_unit) ->
    if map_unit instanceof Tank
      map_unit.ship
    else
      map_unit instanceof Missile
  type: -> "water"
  group: "back"
  weight: (tank) ->
    switch tank.ship
      when true
        4
      when false
        @map.infinity

class IceTerrain extends Terrain
  accept: (map_unit) -> true
  type: -> "ice"
  group: "back"
  weight: (tank) -> 4

class GrassTerrain extends Terrain
  accept: (map_unit) -> true
  type: -> "grass"
  group: "front"
  weight: (tank) -> 4

class HomeTerrain extends Terrain
  constructor: (@map, @area) ->
    super(@map, @area)
  type: -> "home"
  accept: (map_unit) ->
    return true if @destroyed and map_unit instanceof Missile
    false
  weight: (tank) -> 0
  new_display: () ->
    @display_object = new Kinetic.Sprite({
      x: @area.x1,
      y: @area.y1,
      image: @map.image,
      index: 0,
      animations: {
        origin: Animations.terrain('home_origin'),
        destroyed: Animations.terrain('home_destroyed')
      },
      animation: 'origin',
      map_unit: this
    })
  defend: (missile, destroy_area) ->
    return @max_defend_point if @destroyed
    @destroyed = true
    @display_object.setAnimation('destroyed')
    @map.trigger('home_destroyed')
    @max_defend_point

  defend_terrains: () ->
    home_defend_area = new MapArea2D(220, 460, 300, 520)
    home_area = @map.home.area
    _.reject(@map.units_at(home_defend_area), (unit) ->
      unit instanceof HomeTerrain or unit instanceof Tank
    )

  delete_defend_terrains: () ->
    _.each(@defend_terrains(), (terrain) -> terrain.destroy())

  add_defend_terrains: (terrain_cls) ->
    for area in [
      new MapArea2D(220, 460, 260, 480),
      new MapArea2D(260, 460, 300, 480),
      new MapArea2D(220, 480, 240, 520),
      new MapArea2D(280, 480, 300, 520)
    ]
      @map.add_terrain(terrain_cls, area) if _.size(@map.units_at(area)) is 0

  setup_defend_terrains: () ->
    @delete_defend_terrains()
    @add_defend_terrains(IronTerrain)

  restore_defend_terrains: () ->
    @delete_defend_terrains()
    @add_defend_terrains(BrickTerrain)

class Tank extends MovableMapUnit2D
  constructor: (@map, @area) ->
    @hp = 1
    @power = 1
    @level = 1
    @max_missile = 1
    @max_hp = 2
    @missiles = []
    @ship = false
    @guard = false
    @initializing = true
    @frozen = false
    super(@map, @area)
    @bom_on_destroy = true

  dead: () -> @hp <= 0

  level_up: (levels) ->
    @level = _.min([@level + levels, 3])
    @_level_adjust()

  _level_adjust: () ->
    switch @level
      when 1
        @power = 1
        @max_missile = 1
      when 2
        @power = 1
        @hp = _.max([@hp + 1, @max_hp])
        @max_missile = 2
      when 3
        @power = 2
        @hp = _.max([@hp + 1, @max_hp])
        @max_missile = 2
    @update_display()

  hp_up: (lives) -> @hp_down(-lives)

  hp_down: (lives) ->
    @hp -= lives
    if @dead()
      @destroy()
    else
      @level = _.max([1, @level - 1])
      @_level_adjust()

  on_ship: (@ship) -> @update_display()

  fire: () ->
    return unless @can_fire()
    @missiles.push(@map.add_missile(this))

  can_fire: () -> _.size(@missiles) < @max_missile

  freeze: () ->
    @frozen = true
    @update_display()
    @attach_timeout_event(() =>
      @frozen = false
      @update_display()
    , 6000)

  handle_move: (cmd, delta_time) -> super(cmd, delta_time) unless @frozen

  handle_turn: (cmd) -> super(cmd) unless @frozen

  handle_fire: (cmd) ->
    switch cmd.type
      when "fire"
        @fire()

  integration: (delta_time) ->
    return if @initializing or @destroyed
    super(delta_time)
    @handle_fire(cmd) for cmd in @commands

  delete_missile: (missile) -> @missiles = _.without(@missiles, missile)

  after_new_display: () ->
    super()
    @display_object.afterFrame 4, () =>
      @initializing = false
      @update_display()

  destroy: () ->
    super()

class UserTank extends Tank
  constructor: (@map, @area) ->
    super(@map, @area)
    @guard = false
  on_guard: (@guard) ->
    @attach_timeout_event((() => @on_guard(false)), 10000) if @guard
    @update_display()
  speed: 0.13
  defend: (missile, destroy_area) ->
    if missile.parent instanceof UserTank
      @freeze() unless missile.parent is this
      return @max_defend_point - 1
    return @max_defend_point - 1 if @guard
    if @ship
      @on_ship(false)
      return @max_defend_point - 1
    defend_point = _.min(@hp, missile.power)
    @hp_down(missile.power)
    @map.trigger('tank_destroyed', this, missile.parent) if @dead()
    defend_point
  animation_state: () ->
    return "tank_born" if @initializing
    return "#{@type()}_lv#{@level}_with_guard" if @guard
    return "#{@type()}_lv#{@level}_frozen" if @frozen
    return "#{@type()}_lv#{@level}_with_ship" if @ship
    "#{@type()}_lv#{@level}"
  accept: (map_unit) ->
    (map_unit instanceof Missile) and (map_unit.parent is this)

class UserP1Tank extends UserTank
  constructor: (@map, @area) ->
    super(@map, @area)
    @commander = new UserCommander(this, {
      up: 38, down: 40, left: 37, right: 39, fire: 32
    })
  type: -> 'user_p1'

class UserP2Tank extends UserTank
  constructor: (@map, @area) ->
    super(@map, @area)
    @commander = new UserCommander(this, {
      up: 87, down: 83, left: 65, right: 68, fire: 74
    })
  type: -> 'user_p2'

class EnemyTank extends Tank
  constructor: (@map, @area) ->
    super(@map, @area)
    @max_hp = 5
    @hp = 1 + parseInt(Math.random() * (@max_hp - 1))
    @iq = 20 #parseInt(Math.random() * 60)
    @gift_counts = parseInt(Math.random() * @max_hp / 2)
    @direction = 180
    @commander = new EnemyAICommander(this)
  hp_down: (lives) ->
    @map.random_gift() if @gift_counts > 0
    @gift_counts -= lives
    super(lives)
  defend: (missile, destroy_area) ->
    return @max_defend_point - 1 if missile.parent instanceof EnemyTank
    if @ship
      @on_ship(false)
      return @max_defend_point - 1
    defend_point = _.min(@hp, missile.power)
    @hp_down(missile.power)
    @map.trigger('tank_destroyed', this, missile.parent) if @dead()
    defend_point
  animation_state: () ->
    return "tank_born" if @initializing
    prefix = if @level == 3
      'enemy_lv3'
    else if @gift_counts > 0
      "#{@type()}_with_gift"
    else
      "#{@type()}_hp" + _.min([@hp, 4])
    prefix + (if @ship then "_with_ship" else "")
  gift_up: (gifts) -> @gift_counts += gifts
  handle_fire: (cmd) -> super(cmd) unless @frozen
  accept: (map_unit) ->
    map_unit instanceof EnemyTank or ((map_unit instanceof Missile) and
      (map_unit.parent instanceof EnemyTank))

class StupidTank extends EnemyTank
  speed: 0.07
  type: -> 'stupid'

class FoolTank extends EnemyTank
  speed: 0.07
  type: -> 'fool'

class FishTank extends EnemyTank
  speed: 0.13
  type: -> 'fish'

class StrongTank extends EnemyTank
  speed: 0.07
  type: -> 'strong'

class Missile extends MovableMapUnit2D
  speed: 0.20
  constructor: (@map, @parent) ->
    @area = @born_area(@parent)
    super(@map, @area)
    @power = @parent.power
    @energy = @power
    @direction = @parent.direction
    @exploded = false
    @commander = new MissileCommander(this)

  born_area: (parent) ->
    switch parent.direction
      when Direction.UP
        new MapArea2D(parent.area.x1 + @map.default_width/4,
          parent.area.y1,
          parent.area.x2 - @map.default_width/4,
          parent.area.y1 + @map.default_height/2)
      when Direction.DOWN
        new MapArea2D(parent.area.x1 + @map.default_width/4,
          parent.area.y2 - @map.default_height/2,
          parent.area.x2 - @map.default_width/4,
          parent.area.y2)
      when Direction.LEFT
        new MapArea2D(parent.area.x1,
          parent.area.y1 + @map.default_height/4,
          parent.area.x1 + @map.default_width/2,
          parent.area.y2 - @map.default_height/4)
      when Direction.RIGHT
        new MapArea2D(parent.area.x2 - @map.default_width/2,
          parent.area.y1 + @map.default_height/4,
          parent.area.x2,
          parent.area.y2 - @map.default_height/4)

  type: -> 'missile'
  explode: -> @exploded = true

  destroy: () ->
    super()
    @parent.delete_missile(this)

  animation_state: () -> 'missile'

  move: (offset) ->
    can_move = super(offset)
    @attack() unless can_move
    can_move
  attack: () ->
    # if collide with other object, then explode
    destroy_area = @destroy_area()

    if @map.out_of_bound(destroy_area)
      @bom_on_destroy = true
      @energy -= @max_defend_point
    else
      hit_map_units = @map.units_at(destroy_area)
      _.each(hit_map_units, (unit) =>
        defend_point = unit.defend(this, destroy_area)
        @bom_on_destroy = (defend_point == @max_defend_point)
        @energy -= defend_point
      )
    @destroy() if @energy <= 0
  destroy_area: ->
    switch @direction
      when Direction.UP
        new MapArea2D(
          @area.x1 - @default_width/4,
          @area.y1 - @default_height/4,
          @area.x2 + @default_width/4,
          @area.y1
        )
      when Direction.RIGHT
        new MapArea2D(
          @area.x2,
          @area.y1 - @default_height/4,
          @area.x2 + @default_width/4,
          @area.y2 + @default_height/4
        )
      when Direction.DOWN
        new MapArea2D(
          @area.x1 - @default_width/4,
          @area.y2,
          @area.x2 + @default_width/4,
          @area.y2 + @default_height/4
        )
      when Direction.LEFT
        new MapArea2D(
          @area.x1 - @default_width/4,
          @area.y1 - @default_height/4,
          @area.x1,
          @area.y2 + @default_height/4
        )
  defend: (missile, destroy_area) ->
    @destroy()
    @max_defend_point - 1
  accept: (map_unit) ->
    map_unit is @parent or
      (map_unit instanceof Missile and map_unit.parent is @parent)

class Gift extends MapUnit2D
  group: 'gift'

  accept: (map_unit) -> true
  defend: (missile, destroy_area) -> 0

  integration: (delta_time) ->
    return if @destroyed
    tanks = _.select(@map.units_at(@area), (unit) -> unit instanceof Tank)
    _.each(tanks, (tank) => @apply(tank))
    if _.size(tanks) > 0
      @destroy()
      @map.trigger('gift_consumed', this, tanks)
  apply: (tank) ->

  new_display: () ->
    @display_object = new Kinetic.Sprite({
      x: @area.x1,
      y: @area.y1,
      image: @map.image,
      animation: @animation_state(),
      animations: Animations.gifts,
      frameRate: Animations.rate(@animation_state()),
      index: 0,
      map_unit: this
    })

  animation_state: -> @type()

class LandMineGift extends Gift
  apply: (tank) ->
    if tank instanceof EnemyTank
      _.each(@map.user_tanks(), (tank) =>
        tank.destroy()
        @map.trigger('tank_destroyed', tank, null)
      )
    else
      _.each(@map.enemy_tanks(), (tank) =>
        tank.destroy()
        @map.trigger('tank_destroyed', tank, null)
      )
  type: () -> 'land_mine'

class GunGift extends Gift
  apply: (tank) -> tank.level_up(2)
  type: -> 'gun'

class ShipGift extends Gift
  apply: (tank) -> tank.on_ship(true)
  type: -> 'ship'

class StarGift extends Gift
  apply: (tank) -> tank.level_up(1)
  type: -> 'star'

class ShovelGift extends Gift
  apply: (tank) ->
    if tank instanceof UserTank
      @map.home().setup_defend_terrains()
    else
      @map.home().delete_defend_terrains()
    # transfer back to brick after 10 seconds
    @attach_timeout_event(() =>
      @map.home().restore_defend_terrains()
    , 10000)
  type: -> 'shovel'

class LifeGift extends Gift
  apply: (tank) ->
    if tank instanceof EnemyTank
      _.each @map.enemy_tanks(), (enemy_tank) ->
        tank.hp_up(5)
        tank.gift_up(3)
    else
      @map.trigger('tank_life_up', tank)
      # TODO add extra user life
  type: -> 'life'

class HatGift extends Gift
  apply: (tank) ->
    if tank instanceof EnemyTank
      tank.hp_up(5)
    else
      tank.on_guard(true)
  type: -> 'hat'

class ClockGift extends Gift
  apply: (tank) ->
    if tank instanceof EnemyTank
      _.each(@map.user_tanks(), (tank) -> tank.freeze())
    else
      _.each(@map.enemy_tanks(), (tank) -> tank.freeze())
  type: -> 'clock'

class Commander
  constructor: (@map_unit) ->
    @direction = @map_unit.direction
    @commands = []
  direction_action_map: {
    up: Direction.UP,
    down: Direction.DOWN,
    left: Direction.LEFT,
    right: Direction.RIGHT
  }
  # calculate next commands
  next: () ->

  next_commands: ->
    @commands = []
    @next()
    _.uniq(@commands, (command) ->
      return command['params']['direction'] if command['type'] == "direction"
      command['type']
    )
  direction_changed: (action) ->
    new_direction = @direction_action_map[action]
    @map_unit.direction != new_direction
  turn: (action) ->
    new_direction = @direction_action_map[action]
    @commands.push(@_direction_command(new_direction))
  start_move: (offset = null) ->
    @commands.push(@_start_move_command(offset))
  stop_move: () ->
    @commands.push(@_stop_move_command())
  fire: () ->
    @commands.push(@_fire_command())

  # private methods
  _direction_command: (direction) ->
    {
      type: "direction",
      params: { direction: direction }
    }
  _start_move_command: (offset = null) ->
    {
      type: "start_move",
      params: { offset: offset }
    }
  _stop_move_command: -> { type: "stop_move" }
  _fire_command: -> { type: "fire" }

class UserCommander extends Commander
  constructor: (@map_unit, key_setting) ->
    super(@map_unit)
    @key_map = {}
    for key, code of key_setting
      @key_map[code] = key
    @reset()
  reset: () ->
    @key_status = {
      up: false, down: false, left: false, right: false, fire: false
    }
    @inputs = { up: [], down: [], left: [], right: [], fire: [] }

  is_pressed: (key) ->
    @key_status[key]
  set_pressed: (key, bool) ->
    @key_status[key] = bool

  next: ->
    @handle_key_up_key_down()
    @handle_key_press()

  handle_key_up_key_down: () ->
    for key, types of @inputs
      continue if _.isEmpty(types)
      switch (key)
        when "fire"
          @fire()
        when "up", "down", "left", "right"
          if @direction_changed(key)
            @turn(key)
            break
          keyup = _.contains(@inputs[key], "keyup")
          keydown = _.contains(@inputs[key], "keydown")
          if keydown
            @start_move()
          else
            @stop_move() if keyup
    @inputs = { up: [], down: [], left: [], right: [], fire: [] }

  handle_key_press: () ->
    for key in ["up", "down", "left", "right"]
      if @is_pressed(key)
        @turn(key)
        @start_move()
    if @is_pressed("fire")
      @fire()

  add_key_event: (type, key_code) ->
    return true if _.isUndefined(@key_map[key_code])
    key = @key_map[key_code]
    switch type
      when "keyup"
        @set_pressed(key, false)
        @inputs[key].push("keyup")
      when "keydown"
        @set_pressed(key, true)
        @inputs[key].push("keydown")

class EnemyAICommander extends Commander
  constructor: (@map_unit) ->
    super(@map_unit)
    @map = @map_unit.map
    @reset_path()
    @last_area = null
  next: ->
    # move towards home
    if _.size(@path) == 0
      end_vertex = if (Math.random() * 100) <= @map_unit.iq
        @map.home_vertex
      else
        @map.random_vertex()
      @path = @map.shortest_path(@map_unit, @current_vertex(), end_vertex)
      @next_move()
      setTimeout((() => @reset_path()), 2000 + Math.random()*2000)
    else
      @next_move() if @current_vertex().equals(@target_vertex)

    # more chance to fire if can't move
    if @map_unit.can_fire() and @last_area and @last_area.equals(@map_unit.area)
      @fire() if Math.random() < 0.08
    else
      @fire() if Math.random() < 0.01
    # # fire if user or home in front of me
    # targets = _.compact([@map.p1_tank(), @map.p2_tank(), @map.home()])
    # for target in targets
    #   @fire() if @in_attack_range(target.area)

    @last_area = @map_unit.area

  next_move: () ->
    return if _.size(@map_unit.delayed_commands) > 0
    return if _.size(@path) == 0
    @target_vertex = @path.shift()
    [direction, offset] = @offset_of(@current_vertex(), @target_vertex)
    @turn(direction)
    @start_move(offset)

  reset_path: () ->
    @path = []

  offset_of: (current_vertex, target_vertex) ->
    if target_vertex.y1 < current_vertex.y1
      return ["up", current_vertex.y1 - target_vertex.y1]
    if target_vertex.y1 > current_vertex.y1
      return ["down", target_vertex.y1 - current_vertex.y1]
    if target_vertex.x1 < current_vertex.x1
      return ["left", current_vertex.x1 - target_vertex.x1]
    if target_vertex.x1 > current_vertex.x1
      return ["right", target_vertex.x1 - current_vertex.x1]
    ["down", 0]

  current_vertex: () -> @map.vertexes_at(@map_unit.area)

  in_attack_range: (area) ->
    @map_unit.area.x1 == area.x1 or @map_unit.area.y1 == area.y1

class MissileCommander extends Commander
  next: -> @start_move()
