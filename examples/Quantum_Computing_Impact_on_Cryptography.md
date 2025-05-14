## Quantum Computing Impact on Cryptography

### Key Points

-   Quantum computers threaten classical cryptographic algorithms like RSA and ECC due to Shor's algorithm.
-   AES is vulnerable to Grover's algorithm, albeit to a lesser extent than RSA and ECC. AES-256 is more resistant than AES-128.
-   Post-quantum cryptography (PQC) aims to develop algorithms resistant to quantum computer attacks.
-   Quantum Key Distribution (QKD) offers secure key exchange based on quantum mechanics, but faces practical challenges.
-   NIST is standardizing PQC algorithms, and organizations are exploring hybrid QKD/PQC solutions.
-   The timeline for significant quantum attacks is uncertain, but proactive measures are necessary.

---

### Overview

Quantum computing poses a significant threat to modern cryptography. Quantum algorithms like Shor's and Grover's can break or weaken widely used encryption methods. This necessitates the development and adoption of quantum-resistant cryptographic solutions. This report provides an overview of the impact of quantum computing on existing cryptographic algorithms and explores potential solutions like post-quantum cryptography (PQC) and Quantum Key Distribution (QKD).

---

### Detailed Analysis

#### Vulnerabilities of Classical Cryptography

Classical cryptographic algorithms rely on mathematical problems that are difficult for classical computers to solve but are vulnerable to quantum algorithms.

| Algorithm | Vulnerability | Quantum Algorithm | Impact                                                              |
| :-------- | :------------ | :---------------- | :------------------------------------------------------------------ |
| RSA       | Factoring     | Shor's Algorithm  | Efficient factorization of large numbers, breaking RSA encryption   |
| ECC       | Discrete Log  | Shor's Algorithm  | Efficiently solves discrete logarithm problems, breaking ECC encryption |
| AES       | Brute Force   | Grover's Algorithm| Reduces the search space, weakening AES security; AES-256 is stronger |

Shor's algorithm can efficiently factor large numbers, rendering RSA and ECC useless if a sufficiently powerful quantum computer is developed [http://greekcrisis.net/shors-algorithm-quantum-computers/]. Breaking RSA-2048 requires approximately 4000 qubits, and ECC-256 requires about 2500 qubits [https://ej-compute.org/index.php/compute/article/view/146].

Grover's algorithm reduces the brute-force search space for AES, weakening its security [https://ej-compute.org/index.php/compute/article/view/146]. AES-256 is more secure against quantum attacks than AES-128 or AES-192 [https://crypto.stackexchange.com/questions/6712/is-aes-256-a-post-quantum-secure-cipher-or-not].

#### Quantum Computational Resources

Breaking RSA-2048 requires around 4000 qubits and millions of gate operations, potentially achievable within the next decade [https://ej-compute.org/index.php/compute/article/view/146]. A quantum computer breaking RSA-2048 in hours could be built by 2030 for around a billion dollars [https://crypto.stackexchange.com/questions/102671/is-aes-128-quantum-safe]. IBM has a 1121-qubit 'Condor' processor, with leading platforms aiming for two-qubit gate fidelity in the range of 99.9% to 99.99% [https://methodologists.net/Exploring-the-Transformative-Advancements-in-Quantum-Computing-and-Their-Global-Impact-in-2024].

#### Post-Quantum Cryptography (PQC)

Post-quantum cryptography (PQC) involves developing cryptographic algorithms that are secure against attacks by both classical and quantum computers [https://en.wikipedia.org/wiki/Post-quantum_cryptography].

**PQC Algorithm Types**

| Algorithm Type       | Examples                                  | Characteristics                                                              |
| :------------------- | :---------------------------------------- | :--------------------------------------------------------------------------- |
| Lattice-based        | CRYSTALS-Kyber, CRYSTALS-Dilithium, NTRU | Based on the hardness of lattice problems                                    |
| Multivariate         | Rainbow                                   | Based on the difficulty of solving systems of multivariate polynomial equations |
| Hash-based           | SPHINCS+                                  | Based on the security of cryptographic hash functions                         |
| Code-based           | Classic McEliece                          | Based on the difficulty of decoding general linear codes                       |
| Isogeny-based        | CSIDH                                     | Based on isogenies between supersingular elliptic curves                        |
| Symmetric Key Quantum Resistance | AES and SNOW 3G                     | Post quantum resistance to known Symmetric Key Quantum resistance attacks |

PQC algorithms often require larger key sizes compared to pre-quantum algorithms [https://en.wikipedia.org/wiki/Post-quantum_cryptography].

**NIST Standardization**

NIST is conducting a Post-Quantum Cryptography Standardization Process to select PQC algorithms [https://en.wikipedia.org/wiki/Post-quantum_cryptography]. NIST has released the first three finalized post-quantum encryption standards: CRYSTALS-Kyber (ML-KEM), CRYSTALS-Dilithium (ML-DSA), and SPHINCS+ [https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards].

#### Quantum Key Distribution (QKD)

QKD offers a method for secure key exchange leveraging the principles of quantum mechanics [https://www.iosrjournals.org/iosr-jce/papers/Vol16-issue2/Version-11/A0162110109.pdf]. Eavesdropping introduces detectable anomalies due to the disturbance of the quantum system [https://en.wikipedia.org/wiki/Quantum_key_distribution].

**QKD Protocols**

| Protocol | Description |
| :------- | :---------- |
| BB84     | First QKD protocol |
| E91      | Uses entangled photons |
| COW      | Coherent One Way |

Practical challenges include secret key rate, distance, size, cost, and practical security [https://arxiv.org/abs/1606.05853]. The NSA views quantum-resistant cryptography (PQC) as a more cost-effective and easily maintained solution than QKD for securing data in National Security Systems [https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/].

#### Hybrid Approaches

Hybrid security systems integrating PQC and QKD are being explored [https://www.gsma.com/newsroom/wp-content/uploads//IG.18-Hybrid-QKD-and-PQC-security-scenarios-and-use-cases-Whitepaper-v1.0-002.pdf]. Network operators are expected to spend over $6 billion on QKD development and implementation between 2025 and 2030 [https://smartinfrastructuremagazine.com/news/quantum-key-distribution-network-operators-to-spend-6-3-billion-over-next-six-years].

#### Risk Assessment and Timelines

Quantum computing advancements are progressing, creating an urgent need to transition to quantum-safe alternatives [https://ej-compute.org/index.php/compute/article/view/146]. Cryptographic vulnerabilities may emerge within the next 5–10 years [https://ej-compute.org/index.php/compute/article/view/146].

---

### Key Citations

- [Implementation of Shor's Algorithm and Its Demonstrated Quantum ... - JSR](https://www.jsr.org/hs/index.php/path/article/view/6348)

- [Implementation and Analysis of Shor's Algorithm to Break RSA ...](https://www.researchgate.net/publication/377245624_Implementation_and_Analysis_of_Shor's_Algorithm_to_Break_RSA_Cryptosystem_Security)

- [Quantum AI: Shor's Algorithm - How Quantum Computers Break Cryptography ...](http://greekcrisis.net/shors-algorithm-quantum-computers/)

- [vulnerability of RSA/ECC to QC : r/cryptography - Reddit](https://www.reddit.com/r/cryptography/comments/1ajubq8/vulnerability_of_rsaecc_to_qc/)

- [Cyber Security Implications of Quantum Computing: Shor's ...](https://www.academia.edu/127333737/Cyber_Security_Implications_of_Quantum_Computing_Shors_Algorithm_and_Beyond)

- [The Impact of Quantum Computing on Cryptographic Systems: Urgency of ...](https://ej-compute.org/index.php/compute/article/view/146)

- [Exploring AES Encryption Implementation Through Quantum Computing ...](https://sciencepublishinggroup.com/article/10.11648/j.ajcst.20240704.12)

- [CSRC Presentations | CSRC - NIST Computer Security Resource Center](https://csrc.nist.gov/Presentations/2024/practical-cost-of-grover-for-aes-key-recovery)

- [Is AES-256 a post-quantum secure cipher or not?](https://crypto.stackexchange.com/questions/6712/is-aes-256-a-post-quantum-secure-cipher-or-not)

- [RSA's demise from quantum attacks is very much ... - Ars Technica](https://arstechnica.com/information-technology/2023/01/fear-not-rsa-encryption-wont-fall-to-quantum-computing-anytime-soon/)

- [Chinese researchers break RSA encryption with a quantum computer](https://www.csoonline.com/article/3562701/chinese-researchers-break-rsa-encryption-with-a-quantum-computer.html)

- [Quantum Computing and the Risks to the RSA Algorithm](https://robharrisoneu.substack.com/p/quantum-computing-and-the-risks-to)

- [Quantum Computing Breakthrough Could Crack ECC Cryptography ...](https://quantumzeitgeist.com/quantum-computing-breakthrough-could-crack-ecc-cryptography-exposing-internet-secrets-claims-psiquantum-researcher/)

- [Quantum vs. regular computing time to break ECC?](https://crypto.stackexchange.com/questions/35384/quantum-vs-regular-computing-time-to-break-ecc)

- [Is AES-128 quantum safe? - Cryptography Stack Exchange](https://crypto.stackexchange.com/questions/102671/is-aes-128-quantum-safe)

- [How many decades AES-128 will last? : r/cryptography - Reddit](https://www.reddit.com/r/cryptography/13lp9nf/how_many_decades_aes128_will_last/)

- [AES-256 joins the quantum resistance - Fierce Electronics](https://www.fierceelectronics.com/electronics/aes-256-joins-quantum-resistance)

- [The State of Quantum Computing in 2024: Innovations, Challenges, and ...](https://methodologists.net/Exploring-the-Transformative-Advancements-in-Quantum-Computing-and-Their-Global-Impact-in-2024)

- [The Current State of Quantum Computing - IEEE Computer Society](https://www.computer.org/publications/tech-news/research/current-state-of-quantum-computing)

- [The Quantum Hardware Landscape: Competing Architectures](https://quantumzeitgeist.com/quantum-hardware/)

- [Practical Impacts of Quantum Computing - National Institute of ...](https://www.nist.gov/document/post-quantum-cryptography-and-cybersecurity)

- [Quantum Threat Timeline Report 2024 - Global Risk Institute](https://globalriskinstitute.org/publication/2024-quantum-threat-timeline-report/)

- [The quantum threat to blockchain: summary and timeline analysis](https://link.springer.com/article/10.1007/s42484-023-00105-4)

- [Post-quantum cryptography - Wikipedia](https://en.wikipedia.org/wiki/Post-quantum_cryptography)

- [First Four Quantum-Resistant Cryptographic Algorithms - Embedded](https://www.embedded.com/first-four-quantum-resistant-cryptographic-algorithms/)

- [Microsoft's quantum-resistant cryptography is here](https://techcommunity.microsoft.com/blog/microsoft-security-blog/microsofts-quantum-resistant-cryptography-is-here/4238780)

- [Exploring Elliptic Curve vs. Lattice-Based Cryptography for Future ...](https://medium.com/@RocketMeUpCybersecurity/exploring-elliptic-curve-vs-lattice-based-cryptography-for-future-security-0c8426c97deb)

- [[PDF] Performance Comparisons and Migration Analyses of Lattice-based ...](https://eprint.iacr.org/2020/990.pdf)

- [[PDF] A Survey on Code-based Cryptography - arXiv](https://arxiv.org/pdf/2201.07119)

- [Understanding Lattice-Based Cryptography - Blue Goat Cyber](https://bluegoatcyber.com/blog/understanding-lattice-based-cryptography/)

- [A Survey of Code-Based Cryptography - Clemson University](https://open.clemson.edu/cgi/viewcontent.cgi?article=5227&context=all_theses)

- [NIST Releases First 3 Finalized Post-Quantum Encryption Standards](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards)

- [Post-Quantum Cryptography Is a Must to Protect Your Systems | Gartner](https://www.gartner.com/en/articles/post-quantum-cryptography)

- [Secure Data Infrastructure in a Post-Quantum Cryptographic World](https://futurumgroup.com/research-reports/secure-data-infrastructure-in-a-post-quantum-cryptographic-world/)

- [NCSC Sets 2035 Deadline for Post-Quantum Cryptography Migration](https://www.infosecurity-magazine.com/news/ncsc-post-quantum-cryptography/)

- [PQC (Post-Quantum Cryptography): The New Network Security Threat](https://hackhunting.com/2025/01/11/post-quantum-cryptography-the-new-network-security-threat/)

- [Exploring Post-Quantum Cryptography: Review and Directions for the ...](https://www.mdpi.com/2227-7080/12/12/241)

- [[PDF] a performance comparison of some hash functions in hash-based ...](https://jomardpublishing.com/UploadFiles/Files/journals/JTME/V5N3/KaratayM_et_al.pdf)

- [[PDF] Comparative Analysis of Different Cryptographic Hash Functions](http://www.diva-portal.org/smash/get/diva2:1885074/FULLTEXT01.pdf)

- [Multivariate Cryptography - SpringerLink](https://link.springer.com/referenceworkentry/10.1007/978-3-642-27739-9_421-2)

- [Quantum Key Distribution Protocols: A Review](https://www.iosrjournals.org/iosr-jce/papers/Vol16-issue2/Version-11/A0162110109.pdf)

- [Quantum key distribution - Wikipedia](https://en.wikipedia.org/wiki/Quantum_key_distribution)

- [Practical challenges in quantum key distribution - arXiv.org](https://arxiv.org/abs/1606.05853)

- [Quantum Key Distribution (QKD) and Quantum Cryptography QC](https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/)

- [Hybrid QKD and PQC security scenarios and use cases Whitepaper](https://www.gsma.com/newsroom/wp-content/uploads//IG.18-Hybrid-QKD-and-PQC-security-scenarios-and-use-cases-Whitepaper-v1.0-002.pdf)

- [Quantum key distribution: Network… | Smart Infrastructure Magazine](https://smartinfrastructuremagazine.com/news/quantum-key-distribution-network-operators-to-spend-6-3-billion-over-next-six-years)