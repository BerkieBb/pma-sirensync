fx_version 'cerulean'
game 'gta5'

name 'pma-sirensync'
author 'AvarianKnight & BerkieB'
description 'A resource to control and sync siren lights and sounds for FiveM'
version '1.0.6'
license 'MIT'
repository 'https://github.com/BerkieBb/pma-sirensync'

lua54 'yes'
use_experimental_fxv2_oal 'yes'

client_scripts {
	'dist/client/**/*',
	'client/*.lua'
}

server_scripts {
	'dist/server/**/*'
}

dependencies {
	'/server:5104',
	'/onesync',
}