import React, { useState, useCallback, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract } from "wagmi";
import contractAbi from "./abi.json";
import Worker from "./worker.js?worker";
import { Button, Input, Text, Flex, Stack, Box, Heading, Icon, Grid, GridItem, Divider } from "@chakra-ui/react";
import { FaHammer, FaStop, FaRocket } from "react-icons/fa";

// ✅ ที่อยู่ Smart Contract
const contractAddress = "0x8652549D215E3c4e30fe33faa717a566E4f6f00C";

// ✅ ฟังก์ชันแปลงค่า Hash Rate ให้อ่านง่าย
const formatHashRate = (rate) => {
  if (rate >= 1e6) return `${(rate / 1e6).toFixed(2)} MH/s`;
  if (rate >= 1e3) return `${(rate / 1e3).toFixed(2)} kH/s`;
  return `${rate.toFixed(2)} H/s`;
};

const App = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();

  const [logs, setLogs] = useState([]);
  const [isMining, setIsMining] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [nftIndex, setNftIndex] = useState("");
  const [nftId, setNftId] = useState("");
  const [threads, setThreads] = useState(1);
  const [blockNumber, setBlockNumber] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [hashRate, setHashRate] = useState(0);

  // ✅ อ่านค่าจาก Smart Contract
  const { data: fetchedBlockNumber } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "currentBlock",
  });

  const { data: fetchedDifficulty } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "currentDifficulty",
  });

  // ✅ อัปเดต state เมื่อดึงค่าจาก Smart Contract ได้
  useEffect(() => {
    if (fetchedBlockNumber) setBlockNumber(fetchedBlockNumber);
    if (fetchedDifficulty) setDifficulty(fetchedDifficulty);
  }, [fetchedBlockNumber, fetchedDifficulty]);

  // ✅ ฟังก์ชันเริ่มขุด (Start Mining)
  const startMining = useCallback(() => {
    if (!isConnected) return alert("🛑 Please connect wallet first!");
    if (!blockNumber || !difficulty || !nftId) {
      setLogs(logs => [...logs, "⚠️ Waiting for blockNumber, difficulty, or NFT ID... Retrying in 3s"]);
      setTimeout(startMining, 3000);
      return;
    }

    const minerDiff = Math.max(1, parseInt(Number(difficulty) - ((nftId % 100000) / 100)));
    setIsMining(true);
    setLogs(logs => [...logs, `⛏️ Starting mining... | Block: ${blockNumber} | Difficulty: ${minerDiff}`]);

    const newWorkers = [];

    for (let i = 0; i < threads; i++) {
      const worker = new Worker();
      newWorkers.push(worker);

      worker.postMessage({
        blockNumber: blockNumber.toString(),
        difficulty: minerDiff.toString(),
        startNonce: i,
        step: threads,
      });

      worker.onmessage = async (event) => {
        const { nonce, hash, elapsedTime, hashRate, error } = event.data;

        if (error) {
          setLogs(logs => [...logs, `❌ Worker Error: ${error}`]);
          return;
        }

        if (hashRate) {
          setHashRate(prevHashRate => prevHashRate + hashRate);
          return;
        }

        setLogs(logs => [...logs, `✅ Mined! Nonce: ${nonce}, Hash: ${hash}, Time: ${elapsedTime}s`]);

        try {
          const txHash = await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: "submitPoW",
            args: [nftIndex, nftId, nonce, hash],
            account: address,
          });

          setLogs(logs => [...logs, `⏳ Transaction pending: ${txHash}`]);
        } catch (error) {
          setLogs(logs => [...logs, `❌ Error submitting: ${error.message}`]);
        } finally {
          stopMining();
        }
      };
    }

    setWorkers(newWorkers);
  }, [isConnected, writeContract, blockNumber, difficulty, nftIndex, nftId, threads]);

  // ✅ ฟังก์ชันหยุดขุด (Stop Mining)
  const stopMining = useCallback(() => {
    workers.forEach(worker => worker.terminate());
    setWorkers([]);
    setIsMining(false);
    setLogs(logs => [...logs, "🛑 Mining stopped!"]);
    setHashRate(0);
  }, [workers]);

  return (
    <Box p={5} maxW="800px" mx="auto">
      <Heading display="flex" alignItems="center" gap={2}>
        <Icon as={FaRocket} color="red.500" /> CommuDAO Mining
      </Heading>

      {isConnected ? (
        <Stack spacing={3} mt={3}>
          <Text fontSize="sm">Connected: {address}</Text>
          <Button onClick={disconnect} isDisabled={isMining} colorScheme="red">
            Disconnect
          </Button>
        </Stack>
      ) : (
        <Stack spacing={3} mt={3}>
          {connectors.map((connector) => (
            <Button key={connector.id} onClick={() => connect({ connector })} colorScheme="blue">
              Connect with {connector.name}
            </Button>
          ))}
        </Stack>
      )}

      <Divider my={4} />

      <Grid templateColumns="repeat(3, 1fr)" gap={3}>
        <GridItem>
          <Input placeholder="NFT Index" value={nftIndex} onChange={e => setNftIndex(e.target.value)} />
        </GridItem>
        <GridItem>
          <Input placeholder="NFT ID" value={nftId} onChange={e => setNftId(e.target.value)} />
        </GridItem>
        <GridItem>
          <Input placeholder="Threads" type="number" value={threads} onChange={e => setThreads(e.target.value)} />
        </GridItem>
      </Grid>

      <Flex mt={4} gap={3} justifyContent="center">
        <Button leftIcon={<Icon as={FaHammer} />} onClick={startMining} isDisabled={isMining} colorScheme="green">
          Start Mining
        </Button>
        <Button leftIcon={<Icon as={FaStop} />} onClick={stopMining} isDisabled={!isMining} colorScheme="red">
          Stop Mining
        </Button>
      </Flex>

      <Text mt={4} fontSize="lg" fontWeight="bold">
        Hash Rate: {formatHashRate(hashRate)}
      </Text>

      <Box mt={4} p={3} bg="gray.100" borderRadius="md" width="full">
        <Text fontWeight="bold">Logs:</Text>
        <pre>{logs.join("\n")}</pre>
      </Box>
    </Box>
  );
};

export default App;
