import Phaser from 'phaser'

let player
let cursors

const config = {
    width: 800,
    height: 600,
    backgroundColor: 0xffffff,
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

const game = new Phaser.Game(config)

function preload(){
    this.load.image('ground', 'assets/ground.png')
    this.load.image('island', 'assets/island.png')
    this.load.image('star', 'assets/star.png')
    this.load.spritesheet('player', 'assets/player.png', {
        frameWidth: 32,
        frameHeight: 48
    })
}

function create(){
    player = this.physics.add.sprite(380, 500, 'player')

    let platforms = this.physics.add.staticGroup()
    
    platforms.create(400, 588, 'ground')
    platforms.create(600, 450, 'island')
    platforms.create(50, 250, 'island')
    platforms.create(650, 230, 'island')
    platforms.create(260, 550, 'island')
    platforms.create(250, 350, 'island')

    this.physics.add.collider(player, platforms)
    
    let stars = this.physics.add.group()
    
    stars.create(22, 0, 'star')
    stars.create(122, 0, 'star')
    stars.create(222, 0, 'star')
    stars.create(322, 0, 'star')
    stars.create(422, 0, 'star')
    stars.create(522, 0, 'star')
    stars.create(622, 0, 'star')
    stars.create(722, 0, 'star')
    
    this.physics.add.collider(stars, platforms)

    // to get access to keyboard events
    cursors = this.input.keyboard.createCursorKeys()
    
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    // not really an animation as it has only one frame
    this.anims.create({
        key: 'still',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    })
    // these two are repeated to stimulate walking

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 8 }),
        frameRate: 10,
        repeat: -1
    })

    let score = 0
    let scoreText = this.add.text(16, 16, 'Stars: 0', {
        fontSize: '32px',
        fill: '#000'
    })

    this.physics.add.overlap(player, stars, (player, star) => {
        star.disableBody(true, true)
        score += 1
        scoreText.setText('Stars: ' + score)
    }, null, this)
    
}

function update(){
    if (cursors.left.isDown) {
        player.setVelocityX(-160)
        player.anims.play('left', true)
    } else if (cursors.right.isDown) {
        player.setVelocityX(160)
        player.anims.play('right', true)
    } else {
        player.setVelocityX(0)
        player.anims.play('still', true)
    }
    // to allow player to jump
    if(cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-330)
    }
}