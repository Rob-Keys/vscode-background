## Purpose

Configure the shalldie.background extension so the forest image appears at full opacity in the empty editor area, disappears when a code editor is open, does not cover surrounding Kiro panels, and does not introduce pointer latency.

## Final behavior

*Image:* /Users/robkeys/Pictures/macos-sequoia-forest-3840x2160-24082.jpg*Empty editor area:* The image displays at opacity: 1.*Open code editor:* The image is hidden when the editor contains .monaco-editor.*Image region:* The image applies only to [id='workbench.parts.editor'].*Unaffected regions:* The activity bar, file tree, Kiro chat, settings/extensions sidebar, and terminal retain their normal backgrounds.*Visibility changes:* Changes occur immediately without a fade transition.*Rendering:* mix-blend-mode: normal avoids the expensive dark-theme screen-blending operation.
## Configuration

The user settings file is:

text
/Users/robkeys/Library/Application Support/Kiro/User/settings.json
The fullscreen configuration is:

json
"background.fullscreen": {
	  "images": [
	  	    "/Users/robkeys/Pictures/macos-sequoia-forest-3840x2160-24082.jpg"
	  	      ],
	  	        "opacity": 1,
	  	          "size": "cover",
	  	            "position": "center",
	  	              "interval": 0,
	  	                "random": false
	  	                }
	  	                ## Extension changes

	  	                The installed extension is:

	  	                text
	  	                /Users/robkeys/.kiro/extensions/shalldie.background-2.0.10-universal
	  	                ### Runtime and schema

	  	                package.json allows fullscreen opacity values through 1 instead of limiting them to 0.6.

	  	                out/background/PatchGenerator/PatchGenerator.fullscreen.js also accepts values through 1.

	  	                ### Generated fullscreen CSS

	  	                The fullscreen image is attached to the editor part instead of the entire workbench:

	  	                css
	  	                [id='workbench.parts.editor']::after {
	  	                	  content: '';
	  	                	    display: block;
	  	                	      position: absolute;
	  	                	        z-index: 1000;
	  	                	          inset: 0;
	  	                	            pointer-events: none;
	  	                	              background-size: cover;
	  	                	                background-repeat: no-repeat;
	  	                	                  background-position: center;
	  	                	                    opacity: 1;
	  	                	                      transition: none;
	  	                	                        mix-blend-mode: normal;
	  	                	                          background-image: var(--background-fullscreen-img);
	  	                	                          }

	  	                	                          [id='workbench.parts.editor']:has(.monaco-editor)::after {
	  	                	                          	  opacity: 0;
	  	                	                          	  }
	  	                	                          	  ## Active Kiro patch

	  	                	                          	  The currently installed workbench patch is in:

	  	                	                          	  text
	  	                	                          	  /Applications/Kiro.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js
	  	                	                          	  It contains the same editor-only selector, open-editor hide rule, full opacity, snap transition, and normal blend mode.

	  	                	                          	  ## Activation and persistence

	  	                	                          	  Reload Kiro with *Developer: Reload Window* after changing the active workbench file. If the background extension regenerates its patch, run *Background: Install* or *Background: Apply and Reload*.

	  	                	                          	  The changes persist locally until the extension or Kiro replaces the modified files. A Kiro application update can restore the original workbench JavaScript, and an extension update can replace the modified extension files.

	  	                	                          	  ## Validation

	  	                	                          	  The following checks passed after the final changes:

	  	                	                          	  settings.json parses as valid JSON.The extension package.json parses as valid JSON.The modified extension JavaScript passes node --check.The modified Kiro workbench JavaScript passes node --check.The active patch contains the editor-only target, open-editor hide rule, opacity: 1, transition: none, and mix-blend-mode: normal.
	  	                	                          }
	  	                }
	  ]
}
