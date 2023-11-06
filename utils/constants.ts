export const randomSerialNumber = (name: string, id: string, qty: number) => {
  let randomNumber = "";
  let result = [];
  const integers = "0123456789";

  // Get length for loop
  var charactersLength = integers.length;

  // Loop for total number of integers object
  for (let j = 0; j < qty; j++) {
    // Loop for total number of character each integers object
    randomNumber = "";
    for (let i = 0; i < 8; i++) {
      // Get character
      randomNumber += integers.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    // Get Date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const dateNow = dd + mm + yyyy;

    // hide for now
    // const companyAlias = generateCompanyAlias(id);

    // Generate serial number
    const SN = name + id + randomNumber + dateNow;

    // Collect serial number to array
    result.push(SN);
  }
  return result;
};

const generateCompanyAlias = (company: string) => {
  let firstChar = "";
  let middleChar = "";
  let lastChar = "";
  const name = company.split(/\s/).filter((_, idx) => idx !== 0);

  if (name.length === 3) {
    const abbrs = name.map((subname) => subname.charAt(0));

    firstChar = abbrs[0];
    middleChar = abbrs[1];
    lastChar = abbrs[2];
  } else {
    const noSpaceCompany = name.join(" ").replace(/\s+/g, "");
    // find first, middle and last character
    const middleIdx = Math.floor(noSpaceCompany.length / 2);
    firstChar = noSpaceCompany[0];
    lastChar = noSpaceCompany[noSpaceCompany.length - 1];
    middleChar = noSpaceCompany[middleIdx];
  }

  return (firstChar + middleChar + lastChar).toUpperCase();
};
