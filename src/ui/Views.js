UI.Views = {
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
							)//Other items can go below here
						]
					),
					$nE('ul',{"class":"nav navbar-nav navbar-right"},
						[
						  $nE('li',{}, 
						    $nE('p', {"class":"navbar-text", "id":"navbarMapName"}, $cTN('No Map Selected'))
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
	
	/*
	 * View sections
	 */
	 
	 /*
	  * New Map Form
	  */
	newMapForm : function(){
		var form = $nE('form', {"class":"form-horizontal", "role":"form"},
			[
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
										$nE('select', {"class":"form-control", "id":"tilesetFormItem"}),//options needs to be added from the view
										$nE('button', {"class":"btn btn-info btn-sm", "type":"button", "id":"createTileset", "disabled":"disabled"},$cTN('Create TIleset'))
									]
								)
							]
						)
					]
				)
			]
		);
		
		return form;
	},
	
	/*
	 * The inside part of the modal for loading the selection
	 */
	 loadMapSelection : function(){
		//TODO can add a little bit of information if needed here like a screenshot of the map
		var form = $nE('form',{"class":"form-horizontal", "role":"form"},
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
	  var form = $nE('form',{"class":"form-horizontal", "role":"form"},
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
