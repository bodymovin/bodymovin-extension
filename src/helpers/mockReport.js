const mockReport = {
  "layers": [
    {
      "name": "Shape Layer 1",
      "index": 1,
      "type": 4,
      "messages": [],
      "transform": {
        "anchorPoint": [],
        "scale": [],
        "opacity": [],
        "rotation": {
          "isThreeD": false,
          "rotation": []
        },
        "position": {
          "dimensionsSeparated": false,
          "position": []
        }
      },
      "shapes": [
        {
          "name": "Repeater 1",
          "type": "rp",
          "copies": [
            {
              "type": "error",
              "renderers": [
                "skottie",
                "ios",
                "android"
              ],
              "builder": "expressions"
            }
          ],
          "offset": [
            {
              "type": "error",
              "renderers": [
                "skottie",
                "ios",
                "android"
              ],
              "builder": "expressions"
            }
          ],
          "transform": {
            "anchorPoint": [],
            "scale": [],
            "rotation": {
              "isThreeD": false,
              "rotation": []
            },
            "position": {
              "dimensionsSeparated": false,
              "position": []
            },
            "startOpacity": [
              {
                "type": "error",
                "renderers": [
                  "skottie",
                  "ios",
                  "android"
                ],
                "builder": "expressions"
              }
            ],
            "endOpacity": [
              {
                "type": "error",
                "renderers": [
                  "skottie",
                  "ios",
                  "android"
                ],
                "builder": "expressions"
              }
            ]
          }
        },
        {
          "name": "Polystar Path 1",
          "type": "sr",
          "properties": {
            "Points": [],
            "Position": [],
            "Rotation": [],
            "Outer Radius": [],
            "Outer Roundness": []
          },
          "messages": []
        },
        {
          "name": "Merge Paths Add",
          "type": "mm",
          "messages": [
            {
              "type": "error",
              "renderers": [
                "browser",
                "ios",
                "android",
                "skottie"
              ],
              "builder": "merge paths"
            }
          ],
          "properties": {}
        },
        {
          "name": "Merge Paths Sub",
          "type": "mm",
          "messages": [
            {
              "type": "error",
              "renderers": [
                "browser",
                "ios",
                "android",
                "skottie"
              ],
              "builder": "merge paths"
            }
          ],
          "properties": {}
        },
        {
          "name": "Merge Paths Exclude",
          "type": "mm",
          "messages": [],
          "properties": {}
        },
        {
          "name": "Round Corners 1",
          "type": "rd",
          "properties": {
            "Radius": []
          },
          "messages": []
        },
        {
          "name": "Trim Paths 1",
          "type": "tm",
          "properties": {
            "Start": [],
            "End": [],
            "Offset": []
          },
          "messages": []
        },
        {
          "name": "Gradient Stroke 1",
          "type": "gs",
          "properties": {
            "Stroke Width": [],
            "Miter Limit": [],
            "Start Point": [],
            "End Point": [],
            "Highlight Length": [
              {
                "type": "error",
                "renderers": [
                  "skottie",
                  "ios",
                  "android"
                ],
                "builder": "expressions"
              }
            ],
            "Highlight Angle": [],
            "Opacity": []
          },
          "messages": []
        },
        {
          "name": "Gradient Fill 1",
          "type": "gf",
          "properties": {
            "Start Point": [],
            "End Point": [
              {
                "type": "error",
                "renderers": [
                  "skottie",
                  "ios",
                  "android"
                ],
                "builder": "expressions"
              }
            ],
            "Opacity": [
              {
                "type": "error",
                "renderers": [
                  "skottie",
                  "ios",
                  "android"
                ],
                "builder": "expressions"
              }
            ]
          },
          "messages": []
        }
      ]
    }
  ],
  "messages": [],
  "id": 11475
}

export default mockReport