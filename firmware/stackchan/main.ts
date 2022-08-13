declare const global: any

import { Button } from 'button'
import config from 'mc/config'
import Modules from 'modules'
import { Container } from 'piu/MC'
import { Robot } from 'robot'
import { RS30XDriver } from 'rs30x-driver'
import { PWMServoDriver } from 'sg90-driver'
import { defaultMod, StackchanMod } from 'stackchan-mod'

// mod側で 起動直後、ボタン押下時処理、ロボット生成時の処理を実装する
let { onLaunch, onButtonChange, onRobotCreated } = defaultMod
// 以下は、mod側に実装がない場合にmain側の実装を呼ぶための記述？
if (Modules.has("mod")) {
	const mod = Modules.importNow("mod") as StackchanMod
	onLaunch = mod.onLaunch ?? onLaunch
	onButtonChange = mod.onButtonChange ?? onButtonChange
	onRobotCreated = mod.onRobotCreated ?? onRobotCreated
}

// 起動直後の処理
const ap = onLaunch?.()
if (ap == null) {
	throw new Error("Application not created")
}

// RowオブジェクトをApplicationへ追加？（Moddable SDK のドキュメント読まないとよくわからない）
if (globalThis.button == null) {
	trace('adding pseudo buttons for M5Stack Core2\n')
	const buttons = new Row(null, {
		left: 0,
		right: 0,
		top: 240,
		height: 40,
		skin: new Skin({ fill: 'yellow' }),
		contents: [
			new Button({ name: 'A', color: 'red', onButtonChange }),
			new Button({ name: 'B', color: 'green', onButtonChange }),
			new Button({ name: 'C', color: 'blue', onButtonChange }),
		]
	})
	ap.add(buttons)
}

// モータドライバの選択
const driver = config.servo?.driver === "ttl" ? new RS30XDriver({
	panId: 0x01, tiltId: 0x02
}) : new PWMServoDriver()

// ロボット生成（定義元はrobot.ts）
const robot = new Robot({
	renderer: {
		render(face) {
			for (const eye of face.eyes) {
				const avatar = ap.content("avatar") as Container
				if (avatar == null) {
					return
				}
				const { yaw, pitch } = eye.gaze
				const eyeContent = avatar.content(eye.name)
				eyeContent.delegate("onGazeChange", {
					x: Math.sin(yaw),
					y: Math.sin(pitch)
				})
			}
		}
	},
	driver,
	eyes: [{
		name: 'leftEye',
		position: {
			x: 0.03,
			y: -0.0085,
			z: 0.0,
		},
	}, {
		name: 'rightEye',
		position: {
			x: 0.03,
			y: 0.0085,
			z: 0.0,
		},
	}]
})

// ロボット生成後の処理を呼び出し（実装はmod側）
onRobotCreated?.(robot)

// ボタン操作時のコールバック登録（onButtonChangeの実装はmod側）
if (global.button != null) {
	global.button.a.onChanged = function () {
		onButtonChange("A", this.read())
	}
	global.button.b.onChanged = function () {
		onButtonChange("B", this.read())
	}
	global.button.c.onChanged = function () {
		onButtonChange("C", this.read())
	}
}
