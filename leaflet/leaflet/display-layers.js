bounds_group.addLayer(layer_exit_7);
map.addLayer(layer_exit_7);
var overlaysTree = [{
    label: '<img src="legend/exit_7.png" /> exit',
    layer: layer_exit_7
},
{
    label: '<img src="legend/entrance_6.png" /> entrance',
    layer: layer_entrance_6
},
{
    label: 'category<br /><table><tr><td style="text-align: center;"><img src="legend/category_5_0.png" /></td><td></td></tr><tr><td style="text-align: center;"><img src="legend/category_5_1.png" /></td><td></td></tr><tr><td style="text-align: center;"><img src="legend/category_5_2.png" /></td><td></td></tr><tr><td style="text-align: center;"><img src="legend/category_5_3.png" /></td><td></td></tr></table>',
    layer: layer_category_5
},
{
    label: '<img src="legend/Clusters_3.png" /> Clusters',
    layer: layer_Clusters_3
},
{
    label: '<img src="legend/parking_2.png" /> parking',
    layer: layer_parking_2
},
{
    label: '<img src="legend/Chapel_1.png" /> Chapel',
    layer: layer_Chapel_1
},
{
    label: "Esti",
    layer: layer_Esti_0
},
]
var lay = L.control.layers.tree(null, overlaysTree, {
    //namedToggle: true,
    //selectorBack: false,
    //closedSymbol: '&#8862; &#x1f5c0;',
    //openedSymbol: '&#8863; &#x1f5c1;',
    //collapseAll: 'Collapse all',
    //expandAll: 'Expand all',
    collapsed: true,
});
lay.addTo(map);
setBounds();