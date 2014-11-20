UI.Views = function(parent) {
	parent = parent || {};
};
UI.Views.prototype = {
	/*
	 * navbar
	 * Simply makes the navbar
	 */
	 
	navbar : function(){
		var navbar = $nE('nav', {"class":"navbar navbar-default navbar-fixed-top", "role":"navigation","id":"navigation"},
			$nE('div', {"class":"container-fluid"},
				$nE('div', {"class":"collapse navbar-collapse"},[
					$nE('ul',{"class":"nav navbar-nav navbar-left"},
						[
							$nE('li',{"class":"dropdown"},
								[
									$nE('a',{"class":"dropdown-toggle", "data-toggle":"dropdown"}, 
										[
											$cTN('File'),
											$nE('span',{"class":"caret"})
										]
									),
									$nE('ul',{"class":"dropdown-menu","role":"menu"}, 
										[
											$nE('li',{},
												$nE('a',{"id":"newMapNavLink"}, $cTN('New Map'))
											),
											$nE('li',{},
												$nE('a',{"id":"loadMapNavLink"}, $cTN('Load Map'))
											),
											$nE('li',{"class":"divider"}),
											$nE('li',{},
												$nE('a',{"id":"saveMapNavLink"}, $cTN('Save Map'))
											),
											$nE('li',{"class":"divider"}),
											$nE('li',{},
												$nE('a',{"id":"settingsNavLink"}, $cTN('Settings'))
											)
										] 
									)
								]
							),
							$nE('li',{"class":"dropdown"},
								[
									$nE('a',{"class":"dropdown-toggle", "data-toggle":"dropdown"}, 
										[
											$cTN('Tilesets'),
											$nE('span',{"class":"caret"})
										]
									),
									$nE('ul',{"class":"dropdown-menu","role":"menu"}, 
										[
											$nE('li',{},
												$nE('a',{"id":"newTilesetNavLink"}, $cTN('New Tileset'))
											),
											$nE('li',{},
												$nE('a',{"id":"loadTilesetNavLink"}, $cTN('Edit Tileset'))
											)
										] 
									)
								]
							)//Other items can go below here
						]
					),
					$nE('ul',{"class":"nav navbar-nav navbar-right"},
						[
							$nE('li',{}, 
								$nE('p', {"class":"navbar-text", "id":"navbarMapName"}, $cTN('No Map Selected'))
							),
							$nE('li',{},
								$nE('button', {"type":"button", "class":"btn btn-success navbar-btn", "disabled":"disabled", "id":"playGameButton"},
									[
										$nE('span', {"class":"glyphicon glyphicon-play"}),
										$cTN(' Run Game')
									]
								)
							)
						]
					)
					]
				)
			) 
		);   
		return navbar;
	},
	
	/*
	 * This is the main panel that will hold the editor and the grid
	 */
	mainPanel : function(){
		var panel = $nE('div', {"class":"col-md-8"},
			$nE('div', {"class":"panel panel-default"},
				[
					$nE('div', {"class":"panel-heading"},
					[ 
						$nE('button', {"id":"toggleLayers", "class":"btn btn-xs btn-default active", "data-toggle":"button","aria-pressed":"true","autocomplete":"off", "disabled":"disabled"},
							$nE('span', {"class":"glyphicon glyphicon-tasks"}, $cTN(' Layers'))
						),
						$nE('div', {"class":"dropdown pull-right"},
							[
								$nE('a',{"class":"dropdown-toggle", "data-toggle":"dropdown"}, 
									[
										$cTN('Zoom'),
										$nE('span',{"class":"caret"})
									]
								),
								$nE('ul',{"class":"dropdown-menu","role":"menu","id":"gridZoomOptions"}, 
									[
										$nE('li',{},
											$nE('a',{"id":"gridZoom100", "zoom":"100"}, $cTN('100%'))
										),
										$nE('li',{},
											$nE('a',{"id":"gridZoom75", "zoom":"75"}, $cTN('75%'))
										),
										$nE('li',{},
											$nE('a',{"id":"gridZoom50", "zoom":"50"}, $cTN('50%'))
										),
										$nE('li',{},
											$nE('a',{"id":"gridZoom25", "zoom":"25"}, $cTN('25%'))
										),
										$nE('li',{},
											$nE('a',{"id":"gridZoom10", "zoom":"10"}, $cTN('10%'))
										)
									]
								)
							]
						)
					]
					),
					$nE('div', {"class":"panel-body"},
						$nE('div', {"class":"row"},
							[
								$nE('div',{"class":"col-xs-4", "id":"gameLayers"},[
									//add things here
									$nE('button', {"class":"btn btn-primary btn-block", "id":"addLayer", "disabled":"disabled"}, 	$cTN('New Layer')),
									$nE('ul',{"class":"list-group", "id":"layersList"})
								]),
								$nE('div',{"class":"col-xs-8", "id":"gameGrid", "style":"overflow:auto"})
							]
						)
					)
				]
			)
		);
		return panel;
	},
	
	/*
	 * This is the main panel that will hold the editor and the grid
	 */
	toolPanel : function(){
		var panel = $nE('div', {"class":"col-md-4"},
			$nE('div', {"class":"panel panel-default", "id":"toolsPanel"},
					$nE('div', {"class":"panel-body"}, 
						[
							$nE('ul', {"class":"nav nav-tabs", "role":"tablist"},
								[
									$nE('li', {"class":"active", "role":"presentation"},
										$nE('a',{"href":"#gameTilesetContainer", "data-toggle":"tab"},$cTN('Tileset'))
									),
									$nE('li', { "role":"presentation"},
										$nE('a',{"href":"#gameToolsContainer", "data-toggle":"tab"},$cTN('Tools'))
									)
								]
							),
							$nE('div', {"class":"tab-content"},
								[
									$nE('div', {"role":"tabpanel", "class":"tab-pane active", "id":"gameTilesetContainer"}, 
										$nE('div', {"id":"gameTileset"})
									),
									$nE('div', {"role":"tabpanel", "class":"tab-pane", "id":"gameToolsContainer"}, 
										$nE('div', {"id":"gameTools"})
									)
								]
							)
						]	
				)
			)
		);

		return panel;
	},
	
	/*Tools */
	
	tools : function(){
	  var tools = $nE('div',{"class":"well"},
	    [
	      
	            $nE('button', {"class":"btn btn-default disabled toolButton", "id":"selectTool"},
	              [
	              $nE('img', {"class":"center-block", "src":"img/ui/select.png","width":"50px"}),
	              $cTN('Select')
	              ]
	            ),
	      
	          	$nE('button', {"class":"btn btn-default active toolButton", "id":"singleTool"},
	          	  [
	              $nE('img', {"class":"center-block","src":"img/ui/single.png", "width":"50px"}),
	              $cTN('Single')
	              ]
	            ),
	        
	          	$nE('button', {"class":"btn btn-default toolButton", "id":"eraserTool"},
	          	  [
	              $nE('img', {"class":"center-block","src":"img/ui/erase.png", "width":"50px"}),
	              $cTN('Erase')
	              ]
	            ),
	             $nE('button', {"class":"btn btn-default toolButton disabled", "id":"fillTool"},
	              [
	              $nE('img', {"class":"center-block", "src":"img/ui/fill.png","width":"50px"}),
	              $cTN('Fill')
	              ]
	            ),
	      
	          	$nE('button', {"class":"btn btn-default toolButton", "id":"triggerTool"},
	          	  [
	              $nE('img', {"class":"center-block","src":"img/ui/trigger.png", "width":"50px"}),
	              $cTN('Trigger')
	              ]
	            ),
	        
	          	$nE('button', {"class":"btn btn-default toolButton", "id":"spriteTool"},
	          	  [
	              $nE('img', {"class":"center-block","src":"img/ui/sprite.png", "width":"50px"}),
	              $cTN('sprite')
	              ]
	            )
	   ]);	      

	   
	   return tools;
	},
	
	/*
	 *Generic Modal Base  
	 */
	 
	modal : function(){
		var modal = $nE('div',{"class": "modal fade", "id":"mainModal"},
			$nE('div', {"class":"modal-dialog"},
				$nE("div",{"class":"modal-content"},
					[
						$nE("div",{"class":"modal-header"},
							$nE("h4", {"class":"modal-title", "id":"modalTitle"})
						),
						$nE("div", {"class":"modal-body", "id":"modalBody"}),
						$nE("div", {"class":"modal-footer", "id":"modalFooter"},
							[
								$nE("button", {"type":"button", "class":"btn btn-default", "data-dismiss":"modal"},
									$cTN("Close")
								)
							]
						)
					]
				)
			)
		);
		return modal;	 
	},
	
	gameModal : function(){
		var modal = $nE('div',{"class": "modal fade", "id":"gameModal"},
			$nE('div', {"class":"modal-dialog modal-lg"},
				$nE("div",{"class":"modal-content"},
					[
						$nE("div",{"class":"modal-header"},
							$nE("h4", {"class":"modal-title", "id":"gameModalTitle"})
						),
						$nE("div", {"class":"modal-body", "id":"gameModalBody"}),
						$nE("div", {"class":"modal-footer", "id":"gameModalFooter"},
							[
								$nE("button", {"type":"button", "class":"btn btn-default", "data-dismiss":"modal"},
									$cTN("Close")
								)
							]
						)
					]
				)
			)
		);
		return modal;	 
	},
	
	/*
	 * Warning alert
	 */
	alertModal : function(){
		var alert = $nE('div',{"class": "modal fade", "id":"alertModal"},
			$nE('div', {"class":"modal-dialog"},
				$nE("div",{"class":"modal-content"},
					[
						$nE("div", {"class":"modal-body", "id":"alertModalBody"},
							$nE('div', {"class":"alert", "role":"alert"},							
								$nE('div', {"id":"dangerAlertContent"})							
							)
						),
						$nE("div", {"class":"modal-footer", "id":"alertModalFooter"},
							[
								$nE('button', {"type":"button","class":"btn btn-danger ", "id":"continueDanger"}, $cTN('Continue')),
								$nE("button", {"type":"button", "class":"btn btn-default", "data-dismiss":"modal"},
									$cTN("Close")
								)
							]
						)
					]
				)
			)
		)
	
		return alert;
	},
	
	saveGood : function(){
	  var alert = $nE('div', {"id":"saveSuccess","class":"alert alert-success", "role":"alert", "style":"position:absolute;top:20px;left:20px;z-index:10000"},
	    [
	      $nE('button', {"type":"button","class":"close","data-dismiss":"alert"},
	        $nE('span',{"clasS":"glyphicon glyphicon-remove"})
	      ),
	      $cTN('The Map has been saved!')
	    ]
	  );
	  
	  return alert;
	},
	 
	 /*
	  * New Map Form
	  */
	newMapForm : function(){
		var form = $nE('div', {"class":"form-horizontal", "role":"form"},
				$nE('div', {"class":"form-group"},
					[
						$nE('div', {"class":"col-sm-12"},
						[
							$nE('label', {"for":"mapNameFormItem","class":"col-sm-4 control-label"}, $cTN('Map Name')),
							$nE('div', {"class":"col-sm-6"},	
								$nE('input', {"type":"text", "class":"form-control", "id":"mapNameFormItem", "placeholder":"Map Name", "value":"My Map"})
							)
						]
						),
						$nE('div', {"class":"col-sm-12"},
						[
							$nE('label', {"for":"heightFormItem","class":"col-sm-4 control-label"}, $cTN('Height (in Tiles)')),
							$nE('div', {"class":"col-sm-2"},	
								$nE('input', {"type":"text", "class":"form-control", "id":"heightFormItem", "placeholder":"Y", "value":"16"})
							)
						]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"widthFormItem","class":"col-sm-4 control-label"}, $cTN('Width (in Tiles)')),
								$nE('div', {"class":"col-sm-2"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"widthFormItem", "placeholder":"X", "value":"16"})
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"tilesetFormItem","class":"col-sm-4 control-label"}, $cTN('Tileset')),
								$nE('div', {"class":"col-sm-4"},
									[
										$nE('select', {"class":"form-control", "id":"tilesetFormItem"})//options needs to be added from the view
									]
								)
							]
						)
					]
				)
		);
		
		return form;
	},
	
	newLayerForm : function(){
			var form = $nE('div', {"class":"form-horizontal", "role":"form"},
				$nE('div', {"class":"form-group"},
					[
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"layerNameFormItem","class":"col-sm-4 control-label"}, $cTN('Layer Name')),
								$nE('div', {"class":"col-sm-6"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"layerNameFormItem", "placeholder":"New Layer Name", "value":"New Layer"})
								)
							]
						)															
					]
				)
		);
		return form;
	},
	
	newLayer : function() {
		var item = $nE('li', {"class":"list-group-item"},
			[
				
				$nE('h4', {"class":"show"}, $nE('span', {"class":"label label-default layerName"})),
				$nE('div', {"class":"form-group hidden"}, 
					$nE('input', {"type":"text","class":"form-control layerNameFormItem", "placeholder":"Layer Name"})
				),
				$nE('div', {"class":"btn-group"},
					[
						$nE('button', {"class":"btn btn-danger  deleteLayer"},
							$nE('span', {"class":"glyphicon glyphicon-remove-circle"})
						),
						$nE('button', { "class":"btn btn-default active setVisibilityLayer", "data-toggle":"button","aria-pressed":"true","autocomplete":"off"}, 	
							$nE('span', {"class":"glyphicon glyphicon-eye-close"})
						),
						$nE('button', { "class":"btn btn-default makeLayerActive active"},
							$nE('span', {"class":"glyphicon glyphicon-pencil"})
						)
					]
				)
			]			
		);	
		return item;
	},
	
	newTilesetForm : function(){
		var form = $nE('div', {"class":"form-horizontal", "role":"form"},
				$nE('div', {"class":"form-group"},
					[
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"tilesetNameFormItem","class":"col-sm-4 control-label"}, $cTN('Tileset Name')),
								$nE('div', {"class":"col-sm-6"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"tilesetNameFormItem", "placeholder":"Tileset Name", "value":"My Tileset"})
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"tilesetImageFormItem","class":"col-sm-4 control-label"}, $cTN('Tileset Image')),
								$nE('div', {"class":"col-sm-6"},	
									$nE('input', {"type":"file", "class":"form-control", "id":"tilesetImageFormItem"})
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"tileheightFormItem","class":"col-sm-4 control-label"}, $cTN('Tile Height')),
								$nE('div', {"class":"col-sm-2"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"tileheightFormItem", "placeholder":"Tile Height", "value":"64"})
								)
							]
						),	
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"tilewidthFormItem","class":"col-sm-4 control-label"}, $cTN('Tile Width')),
								$nE('div', {"class":"col-sm-2"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"tilewidthFormItem", "placeholder":"Tile Width", "value":"64"})
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"imageheightFormItem","class":"col-sm-4 control-label"}, $cTN('Image Height')),
								$nE('div', {"class":"col-sm-2"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"imageheightFormItem", "placeholder":"Image Height", "value":"256"})
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"imagewidthFormItem","class":"col-sm-4 control-label"}, $cTN('Image width')),
								$nE('div', {"class":"col-sm-2"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"imagewidthFormItem", "placeholder":"Image Width", "value":"256"})
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"collisionTilesFormItem","class":"col-sm-4 control-label"}, $cTN('Collision Tiles')),
								$nE('div', {"class":"col-sm-6"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"collisionTilesFormItem", "placeholder":"Collision Tiles", "value":"1,2,3,4,5,6"})
								)
							]
						)										
					]
				)
		);
		return form;
	},
	
	newTriggerForm : function(){
	  var form = $nE('div', {"class":"form-horizontal", "role":"form"},
				$nE('div', {"class":"form-group"},
				  [
				    $nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"triggerNameFormItem","class":"col-sm-4 control-label"}, $cTN('Trigger Name')),
								$nE('div', {"class":"col-sm-6"},	
									$nE('input', {"type":"text", "class":"form-control", "id":"triggerNameFormItem", "placeholder":"Trigger Name", "value":"New Trigger"})
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"triggerTypeFormItem","class":"col-sm-4 control-label"}, $cTN('Trigger Type')),
								$nE('div', {"class":"col-sm-6"},	
									$nE('select', {"class":"form-control", "id":"triggerTypeFormItem"},
									  [
									    $nE('option', {"value":"sprite"}, $cTN('Sprite')),
									    $nE('option',{"value":"off"}, $cTN('Off Screen'))  
									  ]
									)
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"triggerTriggeredByFormItem","class":"col-sm-4 control-label"}, $cTN('Triggered By')),
								$nE('div', {"class":"col-sm-6"},	
									$nE('select', {"class":"form-control", "id":"triggerTriggeredByFormItem"},
									  [
									    $nE('option', {"value":"collide"}, $cTN('Being Touched')),
									    $nE('option',{"value":"action"}, $cTN('Action Key')),
 									    $nE('option',{"value":"trigger"}, $cTN('Another Trigger')),
 									    $nE('option',{"value":"code"}, $cTN('From Code'))   
									  ]
									)
								)
							]
						),
						$nE('div', {"class":"col-sm-12"},
							[
								$nE('label', {"for":"triggerActionTypeFormItem","class":"col-sm-4 control-label"}, $cTN('Action Type')),
								$nE('div', {"class":"col-sm-6"},	
									$nE('select', {"class":"form-control", "id":"triggerActionTypeFormItem"},
									  [
									    $nE('option', {"value":"addSprite"}, $cTN('Add Sprite')),
									    $nE('option',{"value":"removeSprite"}, $cTN('Remove Sprite')),
 									    $nE('option',{"value":"moveSprite"}, $cTN('Move Sprite')),
 									    $nE('option',{"value":"animateSprite"}, $cTN('Animate Sprite')),
 									    $nE('option',{"value":"showLayer"}, $cTN('Show Layer')),
 									    $nE('option',{"value":"hideLayer"}, $cTN('Hide Layer')),
 									    $nE('option',{"value":"customCode"}, $cTN('Custom Code'))   
									  ]
									)
								)
							]
						),
						$nE('div', {"class":"col-sm-12 hidden"},
							[
								$nE('label', {"for":"triggerImpactItemFormItem","class":"col-sm-4 control-label"}),
								$nE('div', {"class":"col-sm-6", "id":"triggerImpactItemFormItemHolder"})
							]
						),
					]
				)
			);
		
		return form;
		
	},
	
	/*
	 * The inside part of the modal for loading the selection
	 */
	 loadMapSelection : function(){
		//TODO can add a little bit of information if needed here like a screenshot of the map
		var form = $nE('div',{"class":"form-horizontal", "role":"form"},
		  $nE('div', {"class":"form-group"},
			  $nE('div', {"class":"col-sm-12"},
			  	[
			  		$nE('label', {"for":"mapsFormItem","class":"col-sm-4 control-label"}, $cTN('Maps')),
				  	$nE('div', {"class":"col-sm-4"},
				  			$nE('select', {"class":"form-control", "id":"mapsFormItem"})					
					  )
				  ]
			  )
		  )
		);		
		return form;
	},
	
	/*
	* Settings Modal
	*/
	settingsForm : function(){
	  var form = $nE('div',{"class":"form-horizontal", "role":"form"},
	    $nE('div', {"class":"form-group"},
	      [
	        $nE('div', {"class":"col-sm-12"},
						[
							$nE('label', {"for":"mapNameFormItem","class":"col-sm-4 control-label"}, $cTN('Map Name')),
							$nE('div', {"class":"col-sm-6"},	
								$nE('input', {"type":"text", "class":"form-control", "id":"mapNameFormItem", "placeholder":"Map Name"})
							)
						]
					),
					$nE('div', {"class":"col-sm-12"},
						[
							$nE('label', {"for":"tilesetFormItem","class":"col-sm-4 control-label"}, $cTN('Tileset')),
							$nE('div', {"class":"col-sm-4"},
								[
									$nE('select', {"class":"form-control", "id":"tilesetFormItem"}),//options needs to be added from the view
									$nE('button', {"class":"btn btn-info btn-sm", "type":"button", "id":"createTileset", "disabled":"disabled"},$cTN('Create TIleset'))
								]
							)
						]
					)
	      ]
	    ) 
	  );
	  
	  return form; 
	}
	  	 
}
