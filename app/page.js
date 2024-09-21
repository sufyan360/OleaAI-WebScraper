"use client"
import { Stack, Typography } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";


export default function Home() {
  const getData = async () => {

  }
  return (
    <Stack>
      <Typography>Test</Typography>
    </Stack>
  );
}
