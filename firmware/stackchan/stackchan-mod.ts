import Avatar from 'avatar'
import { hsl } from 'piu/All'
import CombTransition from 'piu/CombTransition'
import { Application, Color, Content } from 'piu/MC'
import { Robot, Target } from 'robot'
import Timer from 'timer'

// TODO: assets内のjsファイルと重複しているので、いつか一本化したい（方法がよくわからない）
const speeches_temperature = {
	hot: '今日はあついね',
	cold: '今日はさむいね',
	cool: '今日はすずしいね',
}

const speeches_weather = {
	rainy: '今日は雨が降りそうだね',
	sunny: '今日はいい天気だね',
	clowdy: '今日は曇りだよ',
}

const speeches_feeling = {
	feelgood: '今日はいい気分。今日も1日頑張ろう',
	feeltired: 'ちょっと疲れちゃった。ゆっくりしようかな',
	feelsleepy: 'もうねむねむだよ',
}

const speeches_howabout = {
	howareyou: '今日の調子はどうですか？',
	howhaveyoubeen: '最近なにか良いことはありましたか？',
	lookhappy: 'なんだか、ごきげんじゃないですか？',
	lookbad: '無理はしないでね'
}

const speeches_greetings = {
	goodmorning: 'おはよう',
	getupearly: '早起きだね',
	goodevening: 'こんばんわ',
	goodnight: 'おそくまで、お疲れさま',
	gotobed: 'おやすみなさい',
}

const speeches_all = {
	...speeches_temperature,
	...speeches_weather,
	...speeches_feeling,
	...speeches_howabout,
	...speeches_greetings,
};

const speeches_array = Object.values(speeches_all)

// main.tsに渡すための記述
export interface StackchanMod {
  onLaunch?: () => Application
  onButtonChange?: (buttonName: 'A' | 'B' | 'C', pressed: boolean) => void
  onRobotCreated?: (robot: Robot) => void
  autoLoop?: boolean
}

// TODO: move file local variables to context hooks
let ap: Application
let avatar: Content
let robot: Robot
let target: Target
let isFollowing: boolean = false

function createAvatar(primaryColor: Color, secondaryColor: Color) {
	return new Avatar({
		width: 320,
		height: 240,
		name: 'avatar',
		primaryColor,
		secondaryColor,
		props: {
			autoUpdateGaze: false,
		},
	})
}

function swapFace(primaryColor, secondaryColor) {
  const av = createAvatar(primaryColor, secondaryColor)
  const transition = new CombTransition(250, Math.quadEaseOut, "horizontal", 4);
  ap.run(transition, ap.content("avatar"), av);
}

// 起動直後に呼ばれる関数
// アバターを生成して、アバターを含むapplicationを返す
function onLaunch() {
	avatar = createAvatar('white', 'black')
	const contents = [avatar]
	ap = new Application(null, {
		displayListLength: 4096,
		left: 0,
		top: 0,
		width: 320,
		height: 240,
		skin: new Skin({ fill: 'white' }),
		contents,
	})
	return ap
}

function randomBetween(low: number, high: number): number {
  return Math.random() * (high - low) + low
}

// ロボット生成後に呼ばれる関数
function onRobotCreated(r) {
	robot = r

	// どこを見るか
	// TODO: 見る位置ではなく姿勢を指定する方式に変更したい
	target = new Target(0.1, 0.0, -0.03)
	robot.follow(target)

	// 一定時間毎に見る点を変える処理（現状、ランダムだが...）
	const targetLoop = () => {
		const x = randomBetween(0.4, 1.0)
		const y = randomBetween(-0.4, 0.4)
		// Zが動くとモータが固まる場合があるので、とりあえず固定しておく
		// const z = randomBetween(-0.02, 0.2)
		const z = 0.05
		if (target != null) {
		//   trace(`looking at: (${x}, ${y}, ${z})\n`)
		target.x = x
		target.y = y
		target.z = z
		}
	}
	Timer.repeat(targetLoop, 5000)
}

// ボタン押下時に呼ばれる関数
function onButtonChange(button, isPressed) {
	if (!isPressed) {
		return
	}
	switch (button) {
		case 'A':
			// 指定された位置を見るか、見ないかのスイッチ
			// TODO: 視点(姿勢)を変えつつ、日時・曜日に関することを喋らせたい
			isFollowing = !isFollowing
			if (isFollowing) {
				robot.follow(target)
			} else {
				robot.unfollow()
			}
			break
		case 'B':
			// 顔面の色を変えている
			// TODO: 視点(姿勢)を変えつつ、天気に関することを喋らせたい
			const primaryColor = hsl(randomBetween(0, 360), 1.0, 0.5)
			const secondaryColor = hsl(randomBetween(0, 360), 1.0, 0.5)
			swapFace(primaryColor, secondaryColor)
		break
		case 'C':
			// TODO: 視点(姿勢)を変えつつ、スタックチャンの状態に関することを喋らせたい（雑談機能）
			let speech_val = speeches_array[Math.floor(Math.random() * speeches_array.length)];
			robot.speak(speech_val)
			// robot.speak('今日は曇りだよ')
			/* noop */
			break
	}
}

// main.tsに渡すための記述
export const defaultMod: StackchanMod = {
	onLaunch,
	onRobotCreated,
	onButtonChange,
}
