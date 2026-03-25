// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Traceability {
    address public owner;
    
    // Impacto total (para reporte ESG)
    uint256 public totalKgRecycled;

    // Puntos acumulados por usuario
    mapping(address => uint256) public userPoints;

    // Registros específicos por identificador (ej: Hash de entrega)
    struct RecyclingRecord {
        string materialType;
        uint256 weightKg;
        uint256 pointsAwarded;
        uint256 timestamp;
        address user;
    }
    mapping(bytes32 => RecyclingRecord) public records;

    // Eventos Inmutables
    event PointsMinted(address indexed user, uint256 points, uint256 weightKg);
    event RecordAdded(bytes32 indexed recordId, address indexed user, string materialType, uint256 weightKg);

    // Autorización exclusiva para el backend-ai / admins de SOCIECO
    modifier onlyOwner() {
        require(msg.sender == owner, "Acceso denegado: Solo el backend puede emitir puntos.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev mintPoints: El backend autorizado emite puntos a una billetera tras validar el reciclaje real.
     */
    function mintPoints(
        address _user, 
        uint256 _points, 
        uint256 _weightKg,
        bytes32 _recordId,
        string memory _materialType
    ) public onlyOwner {
        require(records[_recordId].timestamp == 0, "El registro de recoleccion ya existe");

        // Almacenar trazabilidad inmutable del registro
        records[_recordId] = RecyclingRecord({
            materialType: _materialType,
            weightKg: _weightKg,
            pointsAwarded: _points,
            timestamp: block.timestamp,
            user: _user
        });

        // Actualizar balances y métricas ESG globales
        userPoints[_user] += _points;
        totalKgRecycled += _weightKg;

        emit RecordAdded(_recordId, _user, _materialType, _weightKg);
        emit PointsMinted(_user, _points, _weightKg);
    }

    /**
     * @dev getBadges: Retorna las insignias del usuario basadas en umbrales de puntos.
     */
    function getBadges(address _user) public view returns (string[] memory) {
        uint256 points = userPoints[_user];
        
        string[] memory tempBadges = new string[](4);
        uint256 count = 0;

        if (points >= 100) {
            tempBadges[count] = "Semilla Verde";
            count++;
        }
        if (points >= 500) {
            tempBadges[count] = "Reciclador Frecuente";
            count++;
        }
        if (points >= 1000) {
            tempBadges[count] = "Maestro del PET";
            count++;
        }
        if (points >= 2000) {
            tempBadges[count] = "Heroe del CO2";
            count++;
        }

        // Limpiar el array para retornar solo las insignias ganadas
        string[] memory finalBadges = new string[](count);
        for (uint256 i = 0; i < count; i++) {
            finalBadges[i] = tempBadges[i];
        }

        return finalBadges;
    }

    /**
     * @dev verifyImpact: Función pública que consolida todos los KG reciclados. 
     * Sirve como fuente de verdad descentralizada para reportes ambientales (ESG).
     */
    function verifyImpact() public view returns (uint256) {
        return totalKgRecycled;
    }
}
