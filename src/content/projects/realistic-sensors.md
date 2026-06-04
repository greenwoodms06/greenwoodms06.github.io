---
title: 'RealisticSensors'
summary: An Unreal Engine 5 plugin for generating synchronized, timestamped multi-modal sensor data — RGB / depth / segmentation / LiDAR / thermal / DVS / optical flow / IMU — for machine learning and robotics.
date: 2026-06-04
status: active
tags: [unreal-engine, plugin, varsa, sensors, simulation, synthetic-data, machine-learning, robotics, ornl]
repo: https://code.ornl.gov/varsa/unreal/plugins/RealisticSensors
authorship: human
---

![RealisticSensors data-fusion turducken](/projects-media/realistic-sensors-fusion.png)

**What it is.** An Unreal Engine 5 plugin that turns a virtual scene
into a multi-sensor capture rig. Cameras, depth, semantic segmentation,
event cameras, optical flow, IMUs, LiDAR, and thermal — all recording
the *same world* on a *shared clock* with **nanosecond timestamps**.
The point is **fused** data, not just *parallel* data.

**Why.** Training perception models or evaluating sensor placements
needs more than "a camera feed and a depth map" — you need every
modality timestamped against the same frame, with the actor poses and
velocities tracked alongside, in a deterministic pipeline you can rerun
to byte-identical output. RealisticSensors is the rig for that.

## Sensors out of the box

| Sensor | Output | Notes |
|---|---|---|
| `UCameraSensorBase` | RGB images | base class for cameras |
| `USceneCaptureCubeSensor` | cubemap faces | 6-face panoramic |
| `UDepthSensor` | depth maps | linear depth in Unreal units |
| `USemanticSegmentationSensor` | class masks | per-pixel semantic labels |
| `UDVSSensor` | event streams | Dynamic Vision Sensor (event camera) |
| `UOpticalFlowSensor` | flow vectors | per-pixel scene velocity |
| `UIMUSensor` | motion data | 6-DOF inertial |
| `ULiDARSensor` | point clouds | configurable laser scanner |
| `UThermalSensor` | temperature maps | per-pixel °C |

## What makes the rig useful

- **Synchronized capture.** All sensors share one clock. Frame-accurate,
  nanosecond timestamps across every modality — so a depth pixel, an
  RGB pixel, and a LiDAR return at "frame 1234" really do refer to the
  same instant.
- **Three control modes.** **Manual** (user code drives capture),
  **Group** (per-actor sensor groups via `USensorController`),
  **World** (global recording session via `USensorWorldSubsystem`) —
  pick the granularity that matches the experiment.
- **Actor tracking by tag.** Tag any actor with `RS_Track` and its
  transform / bounds / velocity export alongside the sensor data, with
  `RS_Name:<id>` to give it a stable identifier.
- **Level-Sequence integration.** Drive a deterministic dataset from a
  JSON config — actors, keyframes, sequence settings — and rerun for
  byte-identical regeneration.
- **Async export.** Non-blocking file I/O with backpressure control, so
  the simulation doesn't stall on disk.

## Reproducible datasets from JSON

A single JSON file describes the level, the sequence, every actor's
keyframes, and the tags. Python runs it through the sequencer and a
deterministic dataset comes out:

```json
{
  "sequence_settings": {
    "level_path": "/Game/Maps/MyLevel",
    "length_seconds": 10.0,
    "fps": 30
  },
  "actors": [
    {
      "name": "TargetCube",
      "tags": ["RS_Track"],
      "keyframes": [
        {"time": 0.0,  "location": [0, 0, 100]},
        {"time": 10.0, "location": [1000, 0, 100], "rotation": [0, 360, 0]}
      ]
    }
  ]
}
```

## Output structure

```
Saved/RealisticSensors/MySession/
├── ActorName/
│   └── SensorName/
│       ├── rgb/000000.png
│       ├── depth/000000.exr
│       ├── thermal/000000.exr
│       └── metadata/000000.json
└── TrackedActors/
    └── 000000.json
```

Per-frame metadata carries the nanosecond timestamp, world / delta time,
sensor pose, camera intrinsics (for cameras), and output file paths —
enough to reconstruct the capture without ambiguity.

![RealisticSensors run-all overview](/projects-media/realistic-sensors-overview.png)

## Companion analysis tools

The plugin ships a Python suite for each modality: DVS / optical-flow /
IMU / segmentation / LiDAR / thermal / depth / scene-capture analyzers,
plus general utilities (grid-video compositor for side-by-side multi-sensor
video; HDF5 compression and timestamp analysis). Each lives under
`ExternalAssets/sensor_analysis/`.

## Cite as

Initial project by **Scott Greenwood** (greenwoodms@ornl.gov), ORNL.
Published under MIT OR Apache-2.0.
