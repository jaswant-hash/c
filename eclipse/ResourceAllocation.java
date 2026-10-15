package org.cloudbus.cloudsim.examples;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;

import org.cloudbus.cloudsim.Cloudlet;
import org.cloudbus.cloudsim.CloudletSchedulerTimeShared;
import org.cloudbus.cloudsim.Datacenter;
import org.cloudbus.cloudsim.DatacenterBroker;
import org.cloudbus.cloudsim.DatacenterCharacteristics;
import org.cloudbus.cloudsim.Host;
import org.cloudbus.cloudsim.Pe;
import org.cloudbus.cloudsim.Storage;
import org.cloudbus.cloudsim.UtilizationModelFull;
import org.cloudbus.cloudsim.Vm;
import org.cloudbus.cloudsim.VmAllocationPolicySimple;
import org.cloudbus.cloudsim.VmSchedulerTimeShared;
import org.cloudbus.cloudsim.core.CloudSim;
import org.cloudbus.cloudsim.provisioners.BwProvisionerSimple;
import org.cloudbus.cloudsim.provisioners.PeProvisionerSimple;
import org.cloudbus.cloudsim.provisioners.RamProvisionerSimple;

public class ResourceAllocation {

    public static void main(String[] args) {

        try {
            int numUsers = 1;
            Calendar calendar = Calendar.getInstance();
            boolean traceFlag = false;

            // Initialize CloudSim
            CloudSim.init(numUsers, calendar, traceFlag);

            // Create datacenter and broker
            Datacenter datacenter = createDatacenter("Datacenter_0");
            DatacenterBroker broker =
                    new DatacenterBroker("Broker");

            int brokerId = broker.getId();

            // Create 4 virtual machines
            List<Vm> vmList = new ArrayList<>();

            for (int i = 0; i < 4; i++) {
                Vm vm = new Vm(
                        i, brokerId, 1000, 1,
                        1024, 1000, 10000,
                        "Xen",
                        new CloudletSchedulerTimeShared()
                );

                vmList.add(vm);
            }

            broker.submitVmList(vmList);

            // Create 8 cloudlets (tasks)
            List<Cloudlet> cloudletList = new ArrayList<>();

            for (int i = 0; i < 8; i++) {
                Cloudlet cloudlet = new Cloudlet(
                        i, 40000, 1, 300, 300,
                        new UtilizationModelFull(),
                        new UtilizationModelFull(),
                        new UtilizationModelFull()
                );

                cloudlet.setUserId(brokerId);
                cloudletList.add(cloudlet);
            }

            broker.submitCloudletList(cloudletList);

            // Start simulation
            CloudSim.startSimulation();
            CloudSim.stopSimulation();

            // Display results
            List<Cloudlet> resultList =
                    broker.getCloudletReceivedList();

            printCloudletResults(resultList);

            System.out.println("\nSimulation completed successfully.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Create datacenter with 4 hosts
    private static Datacenter createDatacenter(String name)
            throws Exception {

        List<Host> hostList = new ArrayList<>();

        for (int i = 0; i < 4; i++) {
            List<Pe> peList = new ArrayList<>();

            peList.add(new Pe(
                    0, new PeProvisionerSimple(1000)
            ));

            Host host = new Host(
                    i,
                    new RamProvisionerSimple(2048),
                    new BwProvisionerSimple(10000),
                    1000000,
                    peList,
                    new VmSchedulerTimeShared(peList)
            );

            hostList.add(host);
        }

        DatacenterCharacteristics characteristics =
                new DatacenterCharacteristics(
                        "x86",
                        "Linux",
                        "Xen",
                        hostList,
                        10.0,
                        3.0,
                        0.05,
                        0.001,
                        0.0
                );

        return new Datacenter(
                name,
                characteristics,
                new VmAllocationPolicySimple(hostList),
                new LinkedList<Storage>(),
                0
        );
    }

    // Print cloudlet execution results
    private static void printCloudletResults(
            List<Cloudlet> list) {

        System.out.println(
                "\nCloudlet ID\tStatus\t\tDatacenter ID"
                + "\tVM ID\tTime\tStart\tFinish"
        );

        for (Cloudlet cloudlet : list) {

            if (cloudlet.getStatus() == Cloudlet.SUCCESS) {
                System.out.println(
                        cloudlet.getCloudletId()
                        + "\t\tSUCCESS\t\t"
                        + cloudlet.getResourceId()
                        + "\t\t"
                        + cloudlet.getVmId()
                        + "\t"
                        + cloudlet.getActualCPUTime()
                        + "\t"
                        + cloudlet.getExecStartTime()
                        + "\t"
                        + cloudlet.getFinishTime()
                );
            } else {
                System.out.println(
                        cloudlet.getCloudletId()
                        + "\t\tFAILED"
                );
            }
        }
    }
}