import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { useIsFocused } from '@react-navigation/native';

import { permission } from '../modules/app/services';

const Scan = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      try {
        setHasPermission(await permission.checkPermission(permission.permissionTypes.camera));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsScanned(true);
      barcodes.forEach(async (scannedBarcode: any) => {
        if (scannedBarcode.rawValue !== '') {
          Alert.alert('QrCode Value', scannedBarcode.rawValue, [
            {
              text: 'Cancel',
              onPress: () => setIsScanned(false),
              style: 'cancel',
            },
          ]);
        }
      });
    }
  }, [barcodes]); // eslint-disable-line react-hooks/exhaustive-deps

  if (device == null || !hasPermission) {
    return <ActivityIndicator />;
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isScanned ? false : isFocused ? true : false}
      frameProcessor={frameProcessor}
      frameProcessorFps='auto'
    />
  );
};

export default Scan;
