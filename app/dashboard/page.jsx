// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { app } from "@/config/FirebaseConfig";

// function Dashboard() {
//   const auth = getAuth(app);
//   const db = getFirestore(app);
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [business, setBusiness] = useState(null);
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         await isBusinessRegistered(currentUser);
//       } else {
//         // Delay redirect to avoid unnecessary flickers
//         setTimeout(() => {
//           router.replace("/login");
//         }, 500);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const isBusinessRegistered = async (currentUser) => {
//     if (!currentUser) return;

//     const docRef = doc(db, "Business", currentUser.email);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       console.log("Document data:", docSnap.data());
//       setBusiness(docSnap.data());
//     } else {
//       console.log("No such document!");
//       router.replace("/create-business");
//     }
//     setLoading(false);
//   };

//   if (loading) {
//     return <div>Loading....</div>;
//   }

//   return (
//     <>
//       <div>Welcome to your Dashboard, {user?.email}</div>
//       <div>Your Buisness {business?.businessName}</div>
//     </>
//   );
// }

// export default Dashboard;"use client";
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/config/FirebaseConfig";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndBusiness = async () => {
      try {
        setLoading(true);

        // Fetch user details
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          console.error("User fetch error:", userError);
          router.replace("/login");
          return;
        }

        setUser(userData.user);
        console.log("User Data:", userData.user);

        // Fetch business details linked to user email
        const { data: businessData, error: businessError } = await supabase
          .from("Business")
          .select("*")
          .eq("email", userData.user.email)
          .maybeSingle(); // Prevents errors when no data exists

        console.log("Fetched Business Data:", businessData);

        if (businessError || !businessData) {
          console.warn("No business found, redirecting to create-business...");
          router.replace("/create-business");
          return;
        }

        setBusiness(businessData);
      } catch (err) {
        console.error("Error checking business:", err);
      } finally {
        setLoading(false);
      }
    };

    // Check auth state changes and run checkUserAndBusiness()
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          checkUserAndBusiness();
        } else {
          router.replace("/login");
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h3>Welcome, {user?.email}!</h3>
      <h4>Your Business: {business?.business_name || "Not Registered"}</h4>
    </>
  );
};

export default Dashboard;
