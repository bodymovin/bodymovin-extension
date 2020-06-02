const mockReport = {
  "layers": [
    {
      "name": "Shape Layer 1",
      "index": 1,
      "type": 4,
      "messages": [
        {
          "type": "warning",
          "renderers": [
            "browser",
            "skottie",
            "ios",
            "android"
          ],
          "builder": "unhandled layer"
        },
        {
          "type": "warning",
          "renderers": [
            "skottie",
            "ios",
            "android"
          ],
          "builder": "disabled layer"
        }
      ],
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
      "effects": [
        {
          "type": "error",
          "renderers": [
            "browser",
            "ios",
            "android",
            "skottie"
          ],
          "builder": "effects",
          "payload": {
            "effects": [
              "VR Blur",
              "Add Grain"
            ]
          }
        }
      ]
    },
    {
      "name": "Medium Gray-Magenta Solid 4",
      "index": 2,
      "type": 1,
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
          "dimensionsSeparated": true,
          "positionX": [
            {
              "type": "error",
              "renderers": [
                "skottie",
                "ios",
                "android"
              ],
              "builder": "expressions"
            },
            {
              "type": "error",
              "renderers": [
                "browser",
                "skottie",
                "ios",
                "android"
              ],
              "builder": "wiggle"
            }
          ],
          "positionY": []
        }
      }
    },
    {
      "name": "aa_report_precomp",
      "index": 3,
      "type": 0,
      "messages": [
        {
          "type": "warning",
          "renderers": [
            "browser",
            "ios",
            "android"
          ],
          "builder": "motion blur"
        },
        {
          "type": "error",
          "renderers": [
            "skottie",
            "ios",
            "android"
          ],
          "builder": "three d layer"
        },
        {
          "type": "warning",
          "renderers": [
            "browser"
          ],
          "builder": "three d layer"
        }
      ],
      "transform": {
        "anchorPoint": [],
        "scale": [],
        "opacity": [],
        "rotation": {
          "isThreeD": true,
          "rotationX": [],
          "rotationY": [],
          "rotationZ": [],
          "orientation": []
        },
        "position": {
          "dimensionsSeparated": false,
          "position": []
        }
      },
      "layers": [
        {
          "name": "Medium Gray-Magenta Solid 4",
          "index": 1,
          "type": 1,
          "messages": [],
          "transform": {
            "anchorPoint": [],
            "scale": [
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
            "opacity": [],
            "rotation": {
              "isThreeD": false,
              "rotation": []
            },
            "position": {
              "dimensionsSeparated": true,
              "positionX": [
                {
                  "type": "error",
                  "renderers": [
                    "skottie",
                    "ios",
                    "android"
                  ],
                  "builder": "expressions"
                },
                {
                  "type": "error",
                  "renderers": [
                    "browser",
                    "skottie",
                    "ios",
                    "android"
                  ],
                  "builder": "wiggle"
                }
              ],
              "positionY": []
            }
          }
        }
      ],
      "id": 11582
    }
  ],
  "messages": [],
  "id": 11475
}

export default mockReport