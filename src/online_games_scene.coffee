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
    curr_position = (@game.get_config('curr_menu_game') + 1) % @game.get_config('online_games').length
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

