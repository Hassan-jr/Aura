const users = [
    { name: "Alice Johnson", email: "alice.johnson@example.com", username: "alicejohnson" },
    { name: "Bob Smith", email: "bob.smith@example.com", username: "bobsmith" },
    { name: "Charlie Brown", email: "charlie.brown@example.com", username: "charlieb" },
    { name: "Diana Prince", email: "diana.prince@example.com", username: "dianap" },
    { name: "Ethan Hunt", email: "ethan.hunt@example.com", username: "ethanh" },
    { name: "Fiona Gallagher", email: "fiona.g@example.com", username: "fionag" },
    { name: "George Bailey", email: "george.bailey@example.com", username: "georgeb" },
    { name: "Hannah Montana", email: "hannah.m@example.com", username: "hannahm" },
    { name: "Ian Fleming", email: "ian.fleming@example.com", username: "ianf" },
    { name: "Jack Sparrow", email: "jack.sparrow@example.com", username: "jacks" },
    { name: "Karen Walker", email: "karen.w@example.com", username: "karenw" },
    { name: "Leonardo DiCaprio", email: "leo.d@example.com", username: "leod" },
    { name: "Monica Geller", email: "monica.g@example.com", username: "monicag" },
    { name: "Nathan Drake", email: "nathan.d@example.com", username: "nathand" },
    { name: "Olivia Pope", email: "olivia.p@example.com", username: "oliviap" },
    { name: "Peter Parker", email: "peter.parker@example.com", username: "peterp" },
    { name: "Quinn Fabray", email: "quinn.f@example.com", username: "quinnf" },
    { name: "Rachel Green", email: "rachel.g@example.com", username: "rachelg" },
    { name: "Steve Rogers", email: "steve.r@example.com", username: "stever" },
    { name: "Tony Stark", email: "tony.stark@example.com", username: "tonys" },
    { name: "Uma Thurman", email: "uma.t@example.com", username: "umat" },
    { name: "Victor Creed", email: "victor.c@example.com", username: "victorc" },
    { name: "Walter White", email: "walter.w@example.com", username: "walterw" },
    { name: "Xander Cage", email: "xander.c@example.com", username: "xanderc" },
    { name: "Yara Greyjoy", email: "yara.g@example.com", username: "yarag" },
    { name: "Zoe Barnes", email: "zoe.b@example.com", username: "zoeb" },
    { name: "Anna Kendrick", email: "anna.k@example.com", username: "annak" },
    { name: "Brad Pitt", email: "brad.p@example.com", username: "bradp" },
    { name: "Catherine Zeta", email: "catherine.z@example.com", username: "catherinez" },
    { name: "David Tennant", email: "david.t@example.com", username: "davidt" },
  ];
  
  const insertUsers = async () => {
    for (const user of users) {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            username: user.username,
            password: "12345678",
            accountType: "individual",
          }),
        });
        if (response.ok) {
          console.log(`User ${user.username} inserted successfully.`);
        } else {
          console.error(`Failed to insert user ${user.username}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error inserting user ${user.username}:`, error);
      }
    }
  };
  
export default insertUsers;
  