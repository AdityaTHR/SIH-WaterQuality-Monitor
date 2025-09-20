//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "openzeppelin/contracts/access/AccessControl.sol";
contract SmartCommunityHealth is AccessControl{
    bytes32 public constant GOV_ROLE=keccak256("GOV_ROLE");
    bytes32 public constant HOSPITAL_ROLE=keccak256("HOSPITAL_ROLE");
    bytes32 public constant AI_ROLE=keccak256("AI_ROLE");
    bytes32 public constant VILLAGERS_ROLE=keccak256("VILLAGERS_ROLE");
    bytes32 private constant SURVEY_TYPE=keccak256("survey");
    bytes32 private constant PATIENT_TYPE=keccak256("patient");
    bytes32 private constant AI_TYPE=keccak256("ai prediction");
    bytes32 private constant ISSUE_TYPE=keccak256("issue");
    constructor(
        address initialGov,
        address initialHospital,
        address initialAI,
        address initialVillager
    ){
        //DEPLOYER BECOMES THE ADMIN
        _grantRole(DEFAULT_ADMIN_ROLE,msg.sender);
        
        if(initialGov!=address(0)){
            _grantRole(GOV_ROLE,initialGov);
        }

        if(initialHospital!=address(0)){
            _grantRole(HOSPITAL_ROLE,initialHospital);
        }
        
        if(initialAI!=address(0)){
            _grantRole(AI_ROLE,initialAI);

        }
        if(initialVillager!=address(0)){
            _grantRole(VILLAGERS_ROLE,initialVillager);
        }

    }
    struct Record{
        uint256 id;
        string cid;
        address uploader;
        string recordType;
        uint256 timestamp;
        string patientIdHash;
        string encryptedKeyB64;
        bytes32 dataHash;
    }
    struct Issue{
        uint256 id;
        string cid;
        address reporter;
        string village;
        uint256 timestamp;
    }
    struct PatientRecord{
        uint256 id;
        string encryptedHash;
        string disease;
        address patient;
        uint256 timestamp;
    }
    struct Warning{
        uint id;
        uint256 recordId;
        string reason;
        address triggeredBy;
        uint256 timestamp;
    }
    uint256 private _generalRecordCounter;
    uint256 private _patientRecordCounter;
    uint256 private _issueCounter;
    uint256 private _warningCounter;


    mapping(uint256=>Record)public records;
    mapping(uint256=>Issue) public issues;
    mapping(address=>uint256[])private PatientRecordsId;
    mapping(uint256=>PatientRecord) private patientRecords;
    mapping(string=>uint256) public totalCasesByDisease;
    mapping(string =>mapping(uint256=>uint256)) public weeklyCases;
    mapping(string=> mapping(uint256=>uint256)) public monthlyCases;
    mapping(uint256=>Warning) public warnings;
    mapping(string=>uint256) public villageAffectedCount;

    event RecordAdded(uint256 indexed id,string cid,string recordType,string patiendIdHash);
    event issueReported(uint256 indexed id,string cid,string village,address reporter);
    event WarningTriggered(uint256 indexed recordId,string reason,address TriggeredBy);
    event villageCountUpdated(string village,uint256 count);
    event WarningStored(uint256 indexed id,uint256 indexed recordId,string reason,address triggeredBy,uint256 timestamp);

    function grantRoleTo(bytes32 role,address account) external{
        require(hasRole(DEFAULT_ADMIN_ROLE,msg.sender), "admin-only");
        grantRole(role, account);

    }
    function revokeRoleFrom(bytes32 role,address account)external{
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "admin only");
        _revokeRole(role, account);
    }
    function submitRecord(
        string calldata cid,
        string calldata recordType,
        string  calldata patientIdHash,
        string calldata encryptedKeyB64,
        bytes32 dataHash
     ) external returns (uint256){
        if (keccak256(bytes(recordType))==SURVEY_TYPE){
            require(hasRole(GOV_ROLE,msg.sender),"Only Government can submit Survey Records");
        }
        else if(keccak256(bytes(recordType))==AI_TYPE){
            require(hasRole(AI_ROLE,msg.sender),"Only AI can submit predictions");
            }
        else{
            revert("Unauthorised or Invalid Record Type");
        }
        _generalRecordCounter+=1;
        uint256 id= _generalRecordCounter;

        records[id]=Record({
            id:id,
            cid:cid,
            uploader:msg.sender,
            recordType:recordType,
            timestamp:block.timestamp,
            patientIdHash:patientIdHash,
            encryptedKeyB64:encryptedKeyB64,
            dataHash:dataHash
        });
        emit RecordAdded(id, cid, recordType, patientIdHash);
        return id;
     }
     event PatientRecordAdded(uint256 indexed id,address patient,string disease);
     function submitPatientRecord(
        string calldata encryptedHash,
        string calldata disease,
        address patient
     ) external returns (uint256){
        require(hasRole(HOSPITAL_ROLE,msg.sender),"Only Hospital can submit Patient Records");
        _patientRecordCounter+=1;
        uint256 id=_patientRecordCounter;
        patientRecords[id]=PatientRecord({
            id:id,
            encryptedHash:encryptedHash,
            disease:disease,
            patient: patient,
            timestamp:block.timestamp
        });
        PatientRecordsId[patient].push(id);
        totalCasesByDisease[disease]+=1;
        uint256 currentWeek=block.timestamp/1 weeks;
        uint256 currentMonth= block.timestamp/30 days;
        weeklyCases[disease][currentWeek]+=1;
        monthlyCases[disease][currentMonth]+=1;
        emit PatientRecordAdded(id,patient,disease);
        return id;
    }
    function reportIssue(
        string calldata cid,
        string calldata village

    )external returns(uint256){
        require(hasRole(VILLAGERS_ROLE,msg.sender),"Only villagers can report");
        _issueCounter+=1;
        uint256 id=_issueCounter;
        issues[id]=Issue({
            id:id,
            cid:cid,
            reporter:msg.sender,
            village:village,
            timestamp:block.timestamp
        });
        emit issueReported(id,cid,village,msg.sender);
        return id;
    }
    function triggeredWarning(
        uint256 recordId,
        string calldata reason
    ) external {
        require(hasRole(AI_ROLE,msg.sender),"Only AI can trigger warnings");
        _warningCounter+=1;
        uint256 id=_warningCounter;
        warnings[id]=Warning({
            id:id,
            recordId:recordId,
            reason:reason,
            triggeredBy:msg.sender,
            timestamp:block.timestamp
        });
        emit WarningStored(id, recordId, reason, msg.sender, block.timestamp);
        emit WarningTriggered(recordId, reason, msg.sender);

    }
    function setVillageAffectedCount(
        string calldata village,
        uint256 count
    ) external{
        require(hasRole(GOV_ROLE,msg.sender)|| hasRole(HOSPITAL_ROLE,msg.sender),"Only Government or Hospital can set village affected count");
        villageAffectedCount[village]=count;
        emit villageCountUpdated(village,count);
    }
    function getALLRecors() external view returns(PatientRecord[]memory)
    {
        uint256[] memory ids=PatientRecordsId[msg.sender];
        PatientRecord[] memory result=new PatientRecord[](ids.length);
        for(uint256 i=0;i<ids.length;i++){
            result[i]=patientRecords[ids[i]];
        }
        return result;
    }
    function getDiseaseStats(string memory disease) public view returns(uint256 total,uint256 weekly,uint256 monthly){
        uint256 currentWeek=block.timestamp/1 weeks;
        uint256 currentMonth=block.timestamp/30 days;
        return(
            totalCasesByDisease[disease],
            weeklyCases[disease][currentWeek],
            monthlyCases[disease][currentMonth]
        );
    }
    event AnomalyAlert(string disease,string message,uint256 timestamp);
    function triggeredAnomaly(string calldata disease,string calldata message)external{
        require(hasRole(AI_ROLE,msg.sender),"Only AI can trigger anomaly");
        emit AnomalyAlert(disease,message,block.timestamp);
    }
}