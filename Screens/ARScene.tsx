import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroBox,
  ViroMaterials,
} from "@reactvision/react-viro";
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

interface ARSceneProps {
  uri: string;
  goBack: () => void;
}

interface HelloWorldSceneARProps {
  uri: string;
}

interface HelloWorldSceneARState {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  lastScale: number;
  lastRotationY: number;
}

ViroMaterials.createMaterials({
  greenBox: {
    diffuseColor: "#00ff00",
  },
  redBox: {
    diffuseColor: "#ff3333",
  },
});

class HelloWorldSceneAR extends Component<
  HelloWorldSceneARProps,
  HelloWorldSceneARState
> {
  constructor(props: HelloWorldSceneARProps) {
    super(props);
    this.state = {
      position: [0, -1, -2],
      scale: [0.3, 0.3, 0.3],
      rotation: [0, 0, 0],
      lastScale: 0.3,
      lastRotationY: 0,
    };
  }

  onPinch = (pinchState: number, scaleFactor: number) => {
    let { lastScale } = this.state;
    let newScale = lastScale * scaleFactor;

    // Clamp the scale to keep it reasonable
    newScale = Math.max(0.2, Math.min(3.0, newScale));

    if (pinchState === 3) {
      // Pinch gesture ended, update lastScale
      this.setState({ lastScale: newScale });
    }

    this.setState({
      scale: [newScale, newScale, newScale],
    });
  };

  onRotate = (rotateState: number, rotationFactor: number) => {
    const newY = this.state.lastRotationY + rotationFactor;

    if (rotateState === 3) {
      this.setState({ lastRotationY: newY });
    }

    this.setState({
      rotation: [0, newY, 0],
    });
  };

  onDrag = (newPos: [number, number, number]) => {
    this.setState({ position: newPos });
  };

  getBoundaryMaterial = () => {
    const y = this.state.position[1];
    return y >= -1.4 && y <= -0.6 ? "greenBox" : "redBox";
  };

  render() {
    const { uri } = this.props;
    const { position, scale, rotation } = this.state;

    return (
      <ViroARScene>
        <ViroAmbientLight color="#FFFFFF" intensity={600} />
        <ViroARPlaneSelector />

        {/* Optional visual feedback plane */}
        <ViroBox
          position={position}
          scale={[0.3, 0.01, 0.3]}
          materials={this.getBoundaryMaterial()}
          opacity={0.5}
        />

        <Viro3DObject
          source={{ uri }}
          type="GLB"
          position={position}
          scale={scale}
          rotation={rotation}
          dragType="FixedToWorld"
          onDrag={this.onDrag}
          onPinch={this.onPinch}
          onRotate={this.onRotate}
        />
      </ViroARScene>
    );
  }
}

export default function ARScene({ uri, goBack }: ARSceneProps) {
  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{
          scene: () => <HelloWorldSceneAR uri={uri} />,
        }}
        viroAppProps={{ uri }}
        style={styles.f1}
      />
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  f1: { flex: 1 },
  container: {
    flex: 1,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
