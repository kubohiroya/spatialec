import Dexie from 'dexie';
import { PROJECT_TABLE_DB_NAME, RESOURCE_TABLE_DB_NAME } from '../../Constants';
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes,
} from '../../models/GeoDatabaseTableType';
import { LayerPanelState } from '/app/models/LayerPanelState';
import { LayoutState } from '/app/pages/Sim/LayoutState';

export class Projects extends Dexie {
  public layerPanelState: Dexie.Table<LayerPanelState, number>;
  static layerPanelState = 'layerPanelState';

  public layoutState: Dexie.Table<LayoutState, number>;
  static layoutState = 'layoutState';

  public constructor(name: string) {
    super(name);
    this.version(14).stores({
      layerPanelState: '++id',
      layoutState: '++id, &i',
    });
    this.layerPanelState = this.table(Projects.layerPanelState);
    this.layerPanelState.toArray().then((layerPanelState) => {
      if (layerPanelState.length === 0) {
        this.layerPanelState.add({
          mapTileUuid: '',
          gadmGeoJsonUuid: [],
          mapTileEnabled: true,
          gadmGeoJsonEnabled: true,
        });
      }
    });

    this.layoutState = this.table(Projects.layoutState);
  }

  static async saveComponentState(
    uuid: string,
    layoutStates: LayoutState[]
  ) {
    const componentState = layoutStates.map((l, index) => {
      return { ...l,  zIndex: index };
    });
    const db = await Projects.openProject(uuid);
    db.transaction('rw', db.layoutState, async () => {
      await db.layoutState.clear();
      await db.layoutState.bulkAdd(componentState);
    });
  }

  static async getComponentState(
    uuid: string
  ): Promise<LayoutState[] | undefined> {
    const db = await Projects.openProject(uuid);
    return await db.layoutState.toArray();
  }

  async getLayerPanelState(): Promise<LayerPanelState | undefined> {
    const layerPanelState =
      (await this.layerPanelState.toArray()) as LayerPanelState[];
    if (layerPanelState && layerPanelState.length > 0) {
      return layerPanelState[0];
    } else {
      return undefined;
    }
  }

  async getComponentState(name: string): Promise<LayoutState | undefined> {
    return await this.layoutState.where('name').equals(name).last();
  }

  async updateComponentState(
    name: string,
    componentState: Partial<LayoutState>
  ): Promise<void> {
    await this.layoutState.where('name').equals(name).modify(componentState);
  }

  async updateLayerPanelState(layerPanelState: Partial<LayerPanelState>) {
    const draft = (await this.layerPanelState.toArray())[0];
    await this.layerPanelState
      .update(draft, layerPanelState)
      .then(function (updated) {
        if (updated) console.log('updated', draft, layerPanelState, updated);
        else
          console.log('Nothing was updated', draft, layerPanelState, updated);
      });
  }

  public static fileNameOf(type: GeoDatabaseTableType, uuid: string) {
    switch (type) {
      case GeoDatabaseTableTypes.resources:
        return `${RESOURCE_TABLE_DB_NAME}-${uuid}`;
      case GeoDatabaseTableTypes.projects:
        return `${PROJECT_TABLE_DB_NAME}-${uuid}`;
      default:
        throw new Error('invalid type:' + type);
    }
  }

  public static async openProject(uuid: string): Promise<Projects> {
    return new Projects(this.fileNameOf(GeoDatabaseTableTypes.projects, uuid));
  }
}

/*
export async function storeGISPoints(
  source: Array<GeoPointSource>,
): Promise<void> {
  const geoPoints: GeoPointEntity[] = source.map((s) => {
    const mortonNumber = calculateMortonNumber([s.lng, s.lat]);
    const mortonNumbersByLevels =
      calculateMortonNumbersOfZoomLevels(mortonNumber);
    return {
      ...s,
      ...mortonNumbersByLevels,
    };
  });

  await this.points.bulkAdd(geoPoints);
}

*/

/*
Webメルカトル地図で、表示画面のズームレベル、表示領域の中心点の緯度経度、表示領域の幅と高さのピクセル数に応じて、表示されるべきXYZ地図タイルのセットを計算できるようにしている。
Webメルカトル地図に重ねて表示されるポリゴンデータ群がある。あるズームレベルでポリゴンを表示する際に、ポリゴンを内側に含むようなXYZ地図タイルのセットを計算できるようにしている。ポリゴンごと、ズームレベルごとに、ポリゴンを内側に含むようなXYZ地図タイルのセットを管理する。
配列の1つめの次元は、ズームレベルである。
配列の2つめの次元は、下位の構造をグループ化して格納するためのものである。通常はグループは1つだけで、0番目の要素のみが使われる。ポリゴンが日付変更線をまたぐ場合には、0番目の要素が日付変更線の左側のグループ、1番目の要素が日付変更線の右側のグループを格納するために使われる。
配列の3つめの次元は、そのズームレベル・そのグループにおける、ポリゴンを内側に含むようなXYZ地図タイルを示す値を格納する。この値は、XYZ地図タイルのX座標の値およびY座標の値から算出したモートン番号である。

以上のような状況で、表示画面内にXYZ地図タイルとポリゴン群を描画する際に、表示されるべきXYZ地図タイルのモートン番号のセットを算出し、これを用いて、どのポリゴンが表示されるかを検索し抽出をして、描画するようにしたい。

ここで何らかの対策をしなければならないのは、高いズームレベルで大きなポリゴンを表示しようとする場合に、そのポリゴンを表示するために必要とされるXYZ地図タイルの数が、非常に多くなってしまうことである。あるポリゴンを表示するためのズームレベルごとのXYZ地図タイルのセットを計算する際に、低いズームレベルから始めて、地図タイルの数が2以上となる最初のズームレベルまでを計算し、それ以降は計算を行わない。


 */
